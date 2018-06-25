package com.xie.demo.controller;

import com.xie.demo.domain.CustomerInstance;
import com.xie.demo.domain.Result;
import com.xie.demo.domain.SocketSession;
import com.xie.demo.domain.User;
import com.xie.demo.service.*;
import com.xie.demo.untils.ResultUtils;
import net.coobird.thumbnailator.Thumbnails;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import sun.misc.BASE64Decoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class ForgSale {

    @Autowired
    private SendEmailCode sendEmailCode;
    @Autowired
    private CompanyDynamicsService companyDynamicsService;
    @Autowired
    private CommonProblemService commonProblemService;
    @Autowired
    private ContactService contactService;
    @Autowired
    private CustomerInstanceService customerInstanceService;
    @Autowired
    private MangerService mangerService;
    @Autowired
    private CustomerServiceService customerServiceService;

    @Value("${web.upload-path}")
    private String UploadPath;

    @RequestMapping(value = {"/index", "/index.html"})
    public String goto_index(HttpServletRequest request) {
        return "index";
    }
    //进入客服登录界面
    @RequestMapping(value="CustomerServiceLogin.html")
    public String CustomerServiceLogin(){
        return "CustomerServiceLogin";
    }
    //跳转到更新密码页面
    @RequestMapping(value = "/update_password.html")
    public String update_password() {
        return "update_password";
    }
    //  判断要找回密码的管理员账号是否存在
    @ResponseBody
    @PostMapping(value = "/update_password")
    public String confirm_update_password_username(HttpServletRequest request, @RequestParam("username") String username) {
        Boolean result =mangerService.Is_existence_MangerByUsername(username);
        if (result == true) {
            return "true";
        } else
            return "false";
    }
   //填写用户名提交之后
    @PostMapping(value = "/forgetPwd")
    @ResponseBody
    public Result update_password(@RequestParam("username") String username,HttpServletRequest request) {
        User user=new User();
        user.setUsername(username);
        request.getSession().setAttribute("user",user);
        return ResultUtils.success();
    }
  //进入验证身份页面
  @RequestMapping(value = "/forgetPwd2.html")
  public String update_password2(HttpServletRequest request,ModelMap map){
      if (request.getSession().getAttribute("user") != null) {
          User user = (User) request.getSession().getAttribute("user");
          if(mangerService.Is_existence_MangerByUsername(user.getUsername())==false){//管理员账号不存在
              request.getSession().removeAttribute("user");
              return "update_password";
          }else{
               String Email=mangerService.getEmailByUsername(user.getUsername());
               user.setEmail(Email);
              request.getSession().setAttribute("user",user);
              map.addAttribute("email", user.getEmail());
              return "forgetPwd2";
          }
      } else {
          return "update_password";
      }
  }
    //发送邮箱验证码
    @PostMapping(value = "/email_code")
    @ResponseBody
    public Result email_code(HttpServletRequest request, HttpServletResponse response) throws Exception {
        if (request.getSession().getAttribute("user") != null) {

            String to, subject, code = "", username, content;
            Boolean result = false;
            User uer = (User) request.getSession().getAttribute("user");
            username = uer.getUsername();
            if(mangerService.Is_existence_MangerByUsername(uer.getUsername())==false){//管理员账号不存在
                request.getSession().removeAttribute("user");
               // request.getRequestDispatcher("update_password.html").forward(request, response);
                return ResultUtils.error(3,"重新填写用户名");
            }
            to = uer.getEmail().trim();
            for (int i = 0; i < 3; i++)
                code += (int) (Math.floor(Math.random() * 10 + 10));
            subject = "找回密码";
            content = "黑斑蛙销售网站提醒您,你的验证码为:" + code;

            result = sendEmailCode.sendEmail(to, subject, content);
            if (result == false)
                return ResultUtils.error(1,"发送失败");
            else {
                uer.setCode(code);
                request.getSession().setAttribute("user", uer);
                return ResultUtils.success();
            }
        }
//        request.getRequestDispatcher("update_password.html").forward(request, response);//如果没有user对象则跳转到update_password.html
        return ResultUtils.error(2,"没进行找回密码第一步操作");
    }

    //验证输入的验证码是否正确
    @ResponseBody
    @PostMapping(value = "/validate_code")
    public Result validate_code(@RequestParam("code") String code, HttpServletRequest request, HttpServletResponse response) throws Exception {
        if (request.getSession().getAttribute("user") != null) {
            User user = (User) request.getSession().getAttribute("user");
            if(mangerService.Is_existence_MangerByUsername(user.getUsername())==false){//管理员账号不存在
                request.getSession().removeAttribute("user");
//                request.getRequestDispatcher("update_password.html").forward(request, response);
                return ResultUtils.error(1,"请重新填写用户名");
            }
            if (user.getCode() == null) {
                return ResultUtils.error(2, "没发送邮箱验证码");
            } else {
                String true_code = user.getCode();
                if (true_code.contentEquals(code) == true) {
                    user.setResult(1);
                    request.getSession().setAttribute("user", user);
                    return ResultUtils.success();
                } else {
                    return ResultUtils.error(3, "邮箱验证码错误");
                }
            }
        }
//        request.getRequestDispatcher("update_password.html").forward(request, response);//如果没有user对象则跳转到update_password.html
        return ResultUtils.error(4, "没进行找回密码第一步操作");
    }
       @RequestMapping(value = "/forgetPwd3.html")
    public String update_password3(HttpServletRequest request,ModelMap map) {
           if (request.getSession().getAttribute("user") != null) {
               User user = (User) request.getSession().getAttribute("user");
               if(mangerService.Is_existence_MangerByUsername(user.getUsername())==false) {//管理员账号不存在
                   request.getSession().removeAttribute("user");
                   return "update_password";
               }else if(user.getCode()==null||user.getResult()==0){//没进行第二步的验证
                   if(user.getEmail()==null) {
                       String Email=mangerService.getEmailByUsername(user.getUsername());
                       user.setEmail(Email);
                       request.getSession().setAttribute("user",user);
                   }
                       map.addAttribute("email",user.getEmail());
                       return "forgetPwd2.html";
               }else
               return "forgetPwd3";
           }
           else{//没进行第一步的验证
               return "update_password";
           }
    }
    @ResponseBody
    @PutMapping(value = "setNewPassword")
    public Result setNewPassword(@RequestParam("password") String password, HttpServletRequest request, HttpServletResponse response) throws Exception {
        if (request.getSession().getAttribute("user") != null) {
            User user = (User) request.getSession().getAttribute("user");
            if(mangerService.Is_existence_MangerByUsername(user.getUsername())==false){//管理员账号不存在
                request.getSession().removeAttribute("user");
                return ResultUtils.error(1,"请重新填写用户名");
            }
         else
            if (user.getCode()==null||user.getResult() == 0) {
                return ResultUtils.error(2, "没进行身份验证操作");
            } else {
                Boolean result = mangerService.update_passwordByUsername(user.getUsername(), password);
                if (result == false)
                    return ResultUtils.error(3, "重置密码失败");
                else {
                        user.setUpdate(1);
                    request.getSession().setAttribute("user", user);
                    return ResultUtils.success();
                }
            }
        }
        return ResultUtils.error(4, "没进行找回密码第一步操作");
    }



    //完成密码重置
    @RequestMapping(value = "/forgetPwd4.html")
    public String update_password4(HttpServletRequest request, HttpServletResponse response,ModelMap map) {
        if (request.getSession().getAttribute("user") != null) {
            User user = (User) request.getSession().getAttribute("user");
            if(mangerService.Is_existence_MangerByUsername(user.getUsername())==false) {//管理员账号不存在
                request.getSession().removeAttribute("user");
                return "update_password";
            }else if(user.getCode()==null||user.getResult()==0){//没进行第二步的验证
                if(user.getEmail()==null) {
                    String Email=mangerService.getEmailByUsername(user.getUsername());
                    user.setEmail(Email);
                    request.getSession().setAttribute("user",user);
                }
                map.addAttribute("email",user.getEmail());
                return "forgetPwd2.html";
            }else if(user.getUpdate()==0)//没进行第三步验证
                return "forgetPwd3";
            else{
                request.getSession().removeAttribute("user");
                return "forgetPwd4";
            }
        }
        else{//没进行第一步的验证
            return "update_password";
        }
    }

    //分页查询
    //进入客服管理系统
    @RequestMapping(value = "/CustomerService.html")
    public String into_CustomerService() throws IOException {

        return "CustomerService";
    }

    //进入管理员后台
    @RequestMapping(value = "/Managerbackground.html")
    public String into_mangerbackground() {
        return "Managerbackground";
    }


    //添加客户评价
    @ResponseBody
    @RequestMapping(value="addOneCustomerInstance")
    public Result addOneCustomerInstance(@Valid CustomerInstance customerInstance,BindingResult bindingResult){
        if(bindingResult.hasErrors())
            return  ResultUtils.error(1,bindingResult.getFieldError().getDefaultMessage());
        else{
            int id=customerInstanceService.getNextId();
            String pathContent=customerInstance.getPath();
            String imgContent=customerInstance.getImage().trim();
            customerInstance.setPath(id+".txt");
            File file1=new File(UploadPath+"CustomerInstance/image/");
            if(!file1.exists())
            {
                file1.mkdirs();
            }
            File file2=new File(UploadPath+"CustomerInstance/evaluate/");
            if(!file2.exists())
            {
                file2.mkdirs();
            }

             if(imgContent.contentEquals("img/customerimage.jpg")==false)//如果不是默认图片
             { String imgType=imgContent.substring(imgContent.indexOf("/")+1,imgContent.indexOf(";"));
                 customerInstance.setImage("CustomerInstance/image/"+id+"."+imgType);
                 imgContent=imgContent.substring(imgContent.indexOf(",")+1);
                 //把图片存到服务器中

                FileOutputStream out=null;
                try{
                    BASE64Decoder decoder=new BASE64Decoder();//64为译码器
                    byte[] bytes=decoder.decodeBuffer(imgContent);

                    File file=new File(UploadPath+"CustomerInstance/image/"+id+"."+imgType);
                  out=new FileOutputStream(file,false);
                   out.write(bytes);
                   out.flush();
                }catch (Exception e){
                    e.printStackTrace();
                    return ResultUtils.error(2,"图片保存失败");
                }finally {
                    if(out!=null){
                        try{
                            out.close();
                        }catch (Exception e)
                        {
                            e.printStackTrace();
                        }
                    }
                }

             }
            //把评价内容存到服务器中//"CustomerInstance/evaluate"
           File file=new File(UploadPath+"CustomerInstance/evaluate/"+id+".txt");
             FileOutputStream fileOutputStream=null;
            try{
                fileOutputStream=new FileOutputStream(file,false);
                fileOutputStream.write(pathContent.getBytes());
                fileOutputStream.flush();
            }catch (Exception e){
                e.printStackTrace();
                return ResultUtils.error(3,"评价内容保存失败");
            }finally {
                if(fileOutputStream!=null){
                    try{
                        fileOutputStream.close();
                    }catch (Exception e)
                    {
                        e.printStackTrace();
                    }
                }
            }

              if(customerInstanceService.addOneCustomerInstance(customerInstance)==false)
              {
                  return ResultUtils.error(4,"提交失败");
              }
             else
            return ResultUtils.success();
        }
    }
    //判断客服用户名和密码是否正确
    @ResponseBody
    @RequestMapping(value="CustomerServiceLoginValidate")
    public Result CustomerServiceLoginValidate(@RequestParam("username") String username,@RequestParam("password") String password,HttpServletRequest request){
        if(username.contentEquals("")||password.contentEquals(""))
            return ResultUtils.error(2,"用户名或密码不能为空");
        boolean result= customerServiceService.findFirstByUsernameAndPassword(username,password);
        if(result==false)
            return ResultUtils.error(1,"用户名或密码错误");
        else {
            request.getSession().setAttribute("Customer_username",username);
            request.getSession().setAttribute("Customer_password",password);
            SocketSession.customer_usernmame=username;
            SocketSession.customer_password=password;
            return ResultUtils.success();
        }
    }

    //客服退出登录删除session
    @ResponseBody
    @RequestMapping(value="CustomerServiceQuitLogin")
    public Result CustomerServiceQuitLogin(HttpServletRequest request){
        if(request.getSession().getAttribute("Customer_username")!=null){
            request.getSession().removeAttribute("Customer_username");
        }
        if(request.getSession().getAttribute("Customer_password")!=null)
        { request.getSession().removeAttribute("Customer_password");
        }
        return ResultUtils.success();
    }

    //判断管理员用户名和密码是否正确
    @ResponseBody
    @RequestMapping(value="MangerLoginValidate")
    public Result MangerLoginValidate(@RequestParam("username") String username,@RequestParam("password") String password,HttpServletRequest request){
        if(username.contentEquals("")||password.contentEquals(""))
            return ResultUtils.error(2,"用户名或密码不能为空");
       boolean result=mangerService.confirm_UsernameAndPassword(username,password);
       if(result==false)
           return ResultUtils.error(1,"用户名或密码错误");
       else {
            request.getSession().setAttribute("Manger_username",username);
           request.getSession().setAttribute("Manger_password",password);
           return ResultUtils.success();
       }
    }


    //管理员退出登录删除session
    @ResponseBody
    @RequestMapping(value="MangerQuitLogin")
    public Result MangerQuitLogin(HttpServletRequest request){
        if(request.getSession().getAttribute("Manger_username")!=null){
            request.getSession().removeAttribute("Manger_username");
        }
        if(request.getSession().getAttribute("Manger_password")!=null)
        { request.getSession().removeAttribute("Manger_password");
        }
        return ResultUtils.success();
    }

    //获取产品中心的描述
    /**
     * @param type
     * 0表示获取蛙苗描述
     * 1表示获取成蛙描述
     * 2表示获取种蛙描述
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "get_ProductCenterfile1")
    public Result get_ProductCenterfile(@RequestParam("type") int type) {
        List<String> filesDirecory = new ArrayList<String>();
        filesDirecory.add("FrogSeedling/file/describe.txt");
        filesDirecory.add("AdultFrog/file/describe.txt");
        filesDirecory.add("Frog/file/describe.txt");
        if(type>=filesDirecory.size())
            return ResultUtils.error(1,"输入的类型不对");
        File file=new File(UploadPath+filesDirecory.get(type));
        if(!file.exists())
            return ResultUtils.error(2,"没有添加描述");
        String content="";
        FileInputStream in=null;
        byte[] bytes=new byte[1024];
        try {
            in=new FileInputStream(file);
            List<byte[]> list=new ArrayList<>();
            while((in.read(bytes))!=-1){
                list.add(bytes);
                bytes=new byte[1024];
            }
            int length=0;
            for(int j=0;j<list.size();j++){
                length+=list.get(j).length;
            }
            byte[] bytes1=new byte[length];
            int index=0;
            for(int j=0;j<list.size();j++) {
                System.arraycopy(list.get(j),0,bytes1,index,list.get(j).length);
                index+=list.get(j).length;
            }
            content+=new String(bytes1).trim();
            return ResultUtils.success(content);

        }catch (Exception e){
            e.printStackTrace();
            return  ResultUtils.error(3,"读取数据失败");
        }finally {
            if(in!=null)
            { try{
                in.close();}
            catch (Exception e){
                e.printStackTrace();
            }
            }
        }
    }

    //获取公司动态对应文章id的内容
    @ResponseBody
    @RequestMapping(value="get_CompanyDynamics_contentByID1")
    public Result get_CompanyDynamics_contentByID(@RequestParam("id") Integer id){
        String path=companyDynamicsService.getPathById(id);
        if(path==null)
            return ResultUtils.error(1,"ID为"+id+"的文章不存在!");
        else{

            File file=new File(UploadPath+"CompanyDynamics/"+path);
            System.out.println(UploadPath+path);
            if(!file.exists()){
                return ResultUtils.error(2,"存储的文章不存在");
            }
            else{
                FileInputStream in=null;
                String content="";
                try{
                    in=new FileInputStream(file);
                    byte[] bytes=new byte[1024];
                    List<byte[]> list=new ArrayList<>();
                    int i;
                    while((i=in.read(bytes))!=-1){
                        list.add(bytes);
                        bytes=new byte[1024];
                    }
                    int length=0;
                    for(int j=0;j<list.size();j++){
                        length+=list.get(j).length;
                    }
                    byte[] bytes1=new byte[length];
                    int index=0;
                    for(int j=0;j<list.size();j++) {
                        System.arraycopy(list.get(j),0,bytes1,index,list.get(j).length);
                        index+=list.get(j).length;
                    }
                    content+=new String(bytes1).trim();
                    return ResultUtils.success(content);
                }catch (Exception e){
                    e.printStackTrace();
                    return ResultUtils.error(3,"读取文章内容失败");
                }finally {
                    if(in!=null)
                        try{
                            in.close();
                        }catch (Exception ex){
                            ex.printStackTrace();
                        }
                }
            }

        }
    }
    //获取常见问题对应文章id的内容
    @ResponseBody
    @RequestMapping(value="get_CommonProblem_contentByID1")
    public Result get_CommonProblem_contentByID(@RequestParam("id") Integer id){
        String path=commonProblemService.getPathById(id);
        if(path==null)
            return ResultUtils.error(1,"ID为"+id+"的文章不存在!");
        else{

            File file=new File(UploadPath+"CommonProblem/"+path);
            if(!file.exists()){
                return ResultUtils.error(2,"存储的文章不存在");
            }
            else{ FileInputStream in=null;
                String content="";
                try{
                    in=new FileInputStream(file);
                    byte[] bytes=new byte[1024];
                    int i;
                    List<byte[]> list=new ArrayList<>();
                    while((i=in.read(bytes))!=-1){
                        list.add(bytes);
                        bytes=new byte[1024];
                    }
                    int length=0;
                    for(int j=0;j<list.size();j++){
                        length+=list.get(j).length;
                    }
                    byte[] bytes1=new byte[length];
                    int index=0;
                    for(int j=0;j<list.size();j++) {
                        System.arraycopy(list.get(j),0,bytes1,index,list.get(j).length);
                        index+=list.get(j).length;
                    }
                    content+=new String(bytes1).trim();
                    return ResultUtils.success(content);
                }catch (Exception e){
                    e.printStackTrace();
                    return ResultUtils.error(3,"读取文章内容失败");
                }finally {
                    if(in!=null)
                        try{
                            in.close();
                        }catch (Exception ex){
                            ex.printStackTrace();
                        }
                }
            }

        }
    }
    //获取经过审核的客户实例个数
    @ResponseBody
    @RequestMapping(value="getCountCustomerInstancesByType1")
    public Result getCountCustomerInstancesByType()
    {    Integer number=customerInstanceService.getCountCustomerInstancesByType(1);
        if(number==0)
        {
            return  ResultUtils.error(1,"客户实例数量为空");
        }
        else{
            return  ResultUtils.success(number);
        }
    }

    //分页获取客户实例
    @ResponseBody
    @RequestMapping(value="GetCustomerInstancesBypage1")
    public Result GetCustomerInstancesBypage(@RequestParam("page") int page,@RequestParam("size") int size)
    {
        Page<CustomerInstance> page1=customerInstanceService.GetCustomerInstancesBypage(page,size,1);
        List<CustomerInstance> list=page1.getContent();
        FileInputStream in=null;
        for(int i=0;i<list.size();i++)
        {    CustomerInstance customerInstance=list.get(i);
            String path=customerInstance.getPath();
            File file=new File(UploadPath+"CustomerInstance/evaluate/"+path);
            String content="";
            byte[] bytes=new byte[1024];
            if(!file.exists())//如果评价内容不存在就删除这条数据
            {
                customerInstanceService.deleteOneCustomerInstanceById(customerInstance.getId());
                list.remove(i);
            }
            else{
                try{
                    in=new FileInputStream(file);
                    List<byte[]> list1=new ArrayList<>();
                    while((in.read(bytes))!=-1){
                        list1.add(bytes);
                        bytes=new byte[1024];
                    }
                    int length=0;
                    for(int j=0;j<list1.size();j++){
                        length+=list1.get(j).length;
                    }
                    byte[] bytes1=new byte[length];
                    int index=0;
                    for(int j=0;j<list1.size();j++) {
                        System.arraycopy(list1.get(j),0,bytes1,index,list1.get(j).length);
                        index+=list1.get(j).length;
                    }
                    content+=new String(bytes1).trim();
                    list.get(i).setPath(content);
                }catch (Exception e){
                    e.printStackTrace();
                    return ResultUtils.error(2,"读取数据失败");
                }

            }

        }
        if(in!=null)
            try{
                in.close();
            }catch (Exception e){
                e.printStackTrace();
            }

        if(list.size()==0)
            return ResultUtils.error(1,"没有数据");
        else
            return ResultUtils.success(list);
    }
    //获取关于我们的数据
    @ResponseBody
    @RequestMapping(value = "/get_about_first1")
    public Result get_about_first() {
        File file = new File(UploadPath + "about", "about.txt");
        JSONObject json = new JSONObject();
        FileInputStream in = null;
        String content = "";
        if (!file.exists()) {
            return ResultUtils.error(1,"");
        } else {
            try {
                in = new FileInputStream(file);
                byte[] bytes = new byte[1024];
                int i = in.read(bytes);
                List<byte[]> list=new ArrayList<>();
                while (i != -1) {
                    list.add(bytes);
                    bytes = new byte[1024];
                    i = in.read(bytes);
                }
                int length=0;
                for(int j=0;j<list.size();j++){
                    length+=list.get(j).length;
                }
                byte[] bytes1=new byte[length];
                int index=0;
                for(int j=0;j<list.size();j++) {
                    System.arraycopy(list.get(j),0,bytes1,index,list.get(j).length);
                    index+=list.get(j).length;
                }
                content+=new String(bytes1).trim();
                return ResultUtils.success(content);
//                System.out.println(content);
            } catch (Exception e) {
                return ResultUtils.error(2,"");
            } finally {
                if (in != null)
                    try {
                        in.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
            }
        }
    }
    //获取联系信息
    @ResponseBody
    @RequestMapping(value="getContact1")
    public Result getContact(){
        return ResultUtils.success(contactService.getContact());
    }


    //获取一个文件夹下的所有文件绝对路径

    /**
     * @param type
     * 0表示获取资格许可证图片
     *1表示获取基地展示的图片
     * 2表示获取蛙苗图片
     * 3表示成蛙图片
     * 4表示种蛙图片
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "get_filepath1")
    public Result get_filepath(@RequestParam("path") int type) throws IOException{
        List<String> filesDirecory = new ArrayList<String>();
        filesDirecory.add("QualificationPermit\\");
        filesDirecory.add("Basedisplay\\");
        filesDirecory.add("FrogSeedling/image/");
        filesDirecory.add("AdultFrog/image/");
        filesDirecory.add("Frog/image/");
        JSONObject json = new JSONObject();
        List<String> list = new ArrayList<>();
        if (type >= filesDirecory.size())
            return ResultUtils.error(1,"");
        String path = filesDirecory.get(type);
        File file = new File(UploadPath + path);
        if (!file.exists()) {
            return  ResultUtils.error(2,"");
        } else {
            File[] files = file.listFiles();
            for (File file1 : files) {
                if (file1.isFile()) {
                    if(!new File(UploadPath+path+"/small/").exists())
                        new File(UploadPath+path+"/small/").mkdirs();
                        if(!new File(UploadPath+path+"/small/"+file1.getName()).exists())
                        {      if(file1.length()<=0.5*1024*1024)
                            Thumbnails.of(UploadPath+path+file1.getName()).scale(0.6).outputFormat("jpg").toFile(UploadPath+path+"small/"+file1.getName());
                              else if(file1.length()<=1*1024*1024)
                        { Thumbnails.of(UploadPath+path+file1.getName()).scale(0.4).outputFormat("jpg").toFile(UploadPath+path+"small/"+file1.getName());

                        }else if(file1.length()<=2*1024*1024){
                            Thumbnails.of(UploadPath+path+file1.getName()).scale(0.2).outputFormat("jpg").toFile(UploadPath+path+"small/"+file1.getName());

                        }else {
                            Thumbnails.of(UploadPath + path + file1.getName()).scale(0.1).outputFormat("jpg").toFile(UploadPath + path + "small/" + file1.getName());
                        }
                        }
                    if(new File(UploadPath+path+"Original/"+file1.getName()).exists())
                    {
                        new File(UploadPath+path+"Original/"+file1.getName()).delete();           }
                        list.add(path +"small/"+file1.getName());
                }
            }
            return ResultUtils.success(list);

        }
    }

    //获取公司动态的所有文章标题和ID
    @ResponseBody
    @RequestMapping(value="get_all_CompanyDynamics_title1")
    public Result get_all_CompanyDynamics_title(){
        return  ResultUtils.success(companyDynamicsService.getAllCompanyDynamics());
    }
    //获取常见问题的所有文章标题和ID
    @ResponseBody
    @RequestMapping(value="get_all_CommonProblem_title1")
    public Result get_all_CommonProblem_title(){
        return ResultUtils.success(commonProblemService.getAllCommonProblem());
    }
    //获取上传的主页视频
    @ResponseBody
    @RequestMapping(value="get_upload_video1")
    public Result get_upload_video(){
        File file=new File(UploadPath+"indexVideo/");
        if(!file.exists())
            return ResultUtils.error(1,"上传的视频为空");
        List<String> list=new ArrayList<>();
        File[] files=file.listFiles();
        for(int i=0;i<files.length;i++){
            File file1=files[i];
            if(file1.isFile())
                list.add("indexVideo/"+file1.getName());
        }
        return ResultUtils.success(list);
    }
    //访问关于我们的页面
    @RequestMapping(value="AboutUs.html")
    public String into_AboutUs(){
        return "AboutUs";
    }
    //访问资格许可证页面
    @RequestMapping(value="EligibilityPermit.html")
    public String into_EligibilityPermit(){
        return "EligibilityPermit";
    }
    //显示基地展示的页面
    @RequestMapping(value="BaseDisplay.html")
    public String into_BaseDisplay(){
        return "BaseDisplay";
    }
    //显示客户实例
    @RequestMapping(value="CustomerInstance.html")
    public String into_CustomerInstance(){
        return "CustomerInstance";
    }
  //产品中心
    @RequestMapping(value="ProductCenter.html")
    public String into_ProductCenter(){
        return "ProductCenter";
    }
    //访问蛙苗界面
    @RequestMapping(value="FrogSeedling.html")
    public String into_FrogSeedling(){
        return  "FrogSeedling";
    }
    //访问成蛙
    @RequestMapping(value="AdultFrog.html")
    public String into_AdultFrog(){
        return  "AdultFrog";
    }
    //访问种蛙
    @RequestMapping(value="Frog.html")
    public String into_Frog(){
        return "Frog";
    }
    //访问企业资讯
    @RequestMapping(value="EnterpriseInformation.html")
    public String into_EnterpriseInformation(){
        return "EnterpriseInformation";
    }
    //访问公司动态
    @RequestMapping(value="CompanyDynamics.html")
    public String into_CompanyDynamics(){
        return "CompanyDynamics";
    }
    //访问常见问题
    @RequestMapping(value="CommonProblem.html")
    public String into_CommonProblem(){
return "CommonProblem";
    }
    //访问联系我们
    @RequestMapping(value="ContactUs.html")
    public String into_ContactUs(){
        return "ContactUs";
    }
    //访问客户评价
    @RequestMapping(value="CustomerEvaluation.html")
    public String into_CustomerEvaluation(){
        return "CustomerEvaluation";
    }
    //获取产品中心的描述
    /**
     * @param type
     * 0表示获取蛙苗描述
     * 1表示获取成蛙描述
     * 2表示获取种蛙描述
     * @return
     */
    //访问产品中心的内容
    @RequestMapping(value="ProductContent.html")
    public String into_ProductContent(@RequestParam("type") int type,ModelMap map){
        String[] ProductType={"蛙苗","成蛙","种蛙"};
        List<String> filesDirecory = new ArrayList<String>();
        filesDirecory.add("FrogSeedling/file/describe.txt");
        filesDirecory.add("AdultFrog/file/describe.txt");
        filesDirecory.add("Frog/file/describe.txt");
        if(type>=filesDirecory.size())
//            return ResultUtils.error(1,"输入的类型不对");
            return "error";
        File file=new File(UploadPath+filesDirecory.get(type));
        if(!file.exists())
            //return ResultUtils.error(2,"没有添加描述");
            return "error";
        String content="";
        FileInputStream in=null;
        byte[] bytes=new byte[1024];
        try {
            in=new FileInputStream(file);
            List<byte[]> list=new ArrayList<>();
            while((in.read(bytes))!=-1){
                list.add(bytes);
                bytes=new byte[1024];
            }
            int length=0;
            for(int j=0;j<list.size();j++){
                length+=list.get(j).length;
            }
            byte[] bytes1=new byte[length];
            int index=0;
            for(int j=0;j<list.size();j++) {
                System.arraycopy(list.get(j),0,bytes1,index,list.get(j).length);
                index+=list.get(j).length;
            }
            content+=new String(bytes1).trim();
           // return ResultUtils.success(content);
            map.addAttribute("type",ProductType[type]);
            map.addAttribute("content",content);
            return "ProductContent";
        }catch (Exception e){
            e.printStackTrace();
           // return  ResultUtils.error(3,"读取数据失败");
            return "error";
        }finally {
            if(in!=null)
            { try{
                in.close();}
            catch (Exception e){
                e.printStackTrace();
            }
            }
        }
    }

    /**
     * type:0为公司动态，1为常见问题
     * @param type
     * @param title
     * @param id
     * @param map
     * @return
     */
    //获取企业资讯内容
    @RequestMapping(value="EnterpriseInformationContent.html")
    public String into_EnterpriseInformationContent(@RequestParam("type") int type,@RequestParam("title") String title,@RequestParam("id") int id,ModelMap map){
        String[] type1={"公司动态","常见问题"};
        if(type>=2)
            return "error";
        if(type==0){
            String path=companyDynamicsService.getPathById(id);
            if(path==null)
                //return ResultUtils.error(1,"ID为"+id+"的文章不存在!");
                return "error";
            else{

                File file=new File(UploadPath+"CompanyDynamics/"+path);
                System.out.println(UploadPath+path);
                if(!file.exists()){
                    //return ResultUtils.error(2,"存储的文章不存在");
                    return "error";
                }
                else{
                    FileInputStream in=null;
                    String content="";
                    try{
                        in=new FileInputStream(file);
                        byte[] bytes=new byte[1024];
                        List<byte[]> list=new ArrayList<>();
                        int i;
                        while((i=in.read(bytes))!=-1){
                            list.add(bytes);
                            bytes=new byte[1024];
                        }
                        int length=0;
                        for(int j=0;j<list.size();j++){
                            length+=list.get(j).length;
                        }
                        byte[] bytes1=new byte[length];
                        int index=0;
                        for(int j=0;j<list.size();j++) {
                            System.arraycopy(list.get(j),0,bytes1,index,list.get(j).length);
                            index+=list.get(j).length;
                        }
                        content+=new String(bytes1).trim();
                        map.addAttribute("type",type1[type]);
                        map.addAttribute("title",title);
                        map.addAttribute("content",content);
                        System.out.println(type+"//"+title+"//"+content);
                        return "EnterpriseInformationContent";
                    }catch (Exception e){
                        e.printStackTrace();
                       // return ResultUtils.error(3,"读取文章内容失败");
                        return "error";
                    }finally {
                        if(in!=null)
                            try{
                                in.close();
                            }catch (Exception ex){
                                ex.printStackTrace();
                            }
                    }
                }

            }
        }else{
            String path=commonProblemService.getPathById(id);
            if(path==null)
               // return ResultUtils.error(1,"ID为"+id+"的文章不存在!");
                return "error";
            else{

                File file=new File(UploadPath+"CommonProblem/"+path);
                if(!file.exists()){
                    //return ResultUtils.error(2,"存储的文章不存在");
                    return "error";
                }
                else{ FileInputStream in=null;
                    String content="";
                    try{
                        in=new FileInputStream(file);
                        byte[] bytes=new byte[1024];
                        int i;
                        List<byte[]> list=new ArrayList<>();
                        while((i=in.read(bytes))!=-1){
                            list.add(bytes);
                            bytes=new byte[1024];
                        }
                        int length=0;
                        for(int j=0;j<list.size();j++){
                            length+=list.get(j).length;
                        }
                        byte[] bytes1=new byte[length];
                        int index=0;
                        for(int j=0;j<list.size();j++) {
                            System.arraycopy(list.get(j),0,bytes1,index,list.get(j).length);
                            index+=list.get(j).length;
                        }
                        content+=new String(bytes1).trim();
                        map.addAttribute("type",type1[type]);
                        map.addAttribute("title",title);
                        map.addAttribute("content",content);
                        //return ResultUtils.success(content);
                        return "EnterpriseInformationContent";
                    }catch (Exception e){
                        e.printStackTrace();
                       // return ResultUtils.error(3,"读取文章内容失败");
                        return "error";
                    }finally {
                        if(in!=null)
                            try{
                                in.close();
                            }catch (Exception ex){
                                ex.printStackTrace();
                            }
                    }
                }

            }
        }

    }
    //测试页面
    @RequestMapping(value = "/2")
    public String test1() {
        return "forgetPwd2";
    }

    @PostMapping(value = "/3")
    @ResponseBody
    public String email_code1(HttpServletRequest request, HttpServletResponse response) {
        String to, subject, code = "", username, content;
        Boolean result;
        username = "谢李峰";
        to = "1637586409@qq.com";
        for (int i = 0; i < 3; i++)
            code += (int) (Math.floor(Math.random() * 10 + 10));
        subject = "找回密码";
        content = "黑斑蛙销售网站提醒您," + username + "你的验证码为:" + code;
        System.out.println(to + "//" + subject + "//" + code + "//" + content);
        result = sendEmailCode.sendEmail(to, subject, content);
        if (result == false)
            return "false";
        else {
            return "true";
        }

    }

       @RequestMapping(value = "/3")
    public String test3(HttpServletRequest request,HttpServletResponse response) {
//        request.setCharacterEncoding("utf-8");

        return "forgetPwd4";
    }
}
