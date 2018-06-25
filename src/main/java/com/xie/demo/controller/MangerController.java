package com.xie.demo.controller;

import com.xie.demo.domain.*;
import com.xie.demo.service.*;
import com.xie.demo.untils.ResultUtils;
import net.coobird.thumbnailator.Thumbnails;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * MR.XIE
 * 2018/5/13 11:05
 * 管理员后台
 **/
@Controller
public class MangerController {
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
    private CustomerServiceService customerServiceService;
    @Autowired
    private MangerService mangerService;
    @Value("${web.upload-path}")
    private String UploadPath;
    //保存关于我们的编辑内容
    @ResponseBody
    @RequestMapping(value = "/save_about_first")
    public Result save_about_first(@RequestParam("content") String content, HttpServletRequest request) {
        File file = new File(UploadPath);
        if (!file.exists())
            file.mkdir();
        File file1 = new File(UploadPath + "about");
        if (!file1.exists())
            file1.mkdir();
        File file2 = new File(file1, "about.txt");
        FileOutputStream out = null;
        try {
            if (!file2.exists())
                file2.createNewFile();
            out = new FileOutputStream(file2, false);
            byte[] bytes = content.getBytes();
            out.write(bytes);
            out.flush();
            return ResultUtils.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResultUtils.error(1,"");
        } finally {
            if (out != null)
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }
    //获取关于我们的数据
    @ResponseBody
    @RequestMapping(value = "/get_about_first")
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

    //保存上传资格许可证的图片
    @ResponseBody
    @RequestMapping(value = "save_about_second")
    public Result save_about_second(HttpServletRequest request) {
        File file = new File(UploadPath);
        if (!file.exists())
            file.mkdir();
        File file1 = new File(UploadPath + "QualificationPermit");
        if (!file1.exists())
            file1.mkdir();
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles(("files[]"));
        MultipartFile file2 = null;
        FileOutputStream out = null;
        try {
            for (int i = 0; i < files.size(); i++) {
                file2 = files.get(i);
                if(!new File(UploadPath + "QualificationPermit/Original/").exists())
                    new File(UploadPath + "QualificationPermit/Original/").mkdirs();
                out = new FileOutputStream(new File(UploadPath + "QualificationPermit/Original/", file2.getOriginalFilename()), false);
                byte[] bytes = file2.getBytes();
                out.write(bytes);
                if(!new File(UploadPath+"QualificationPermit/"+"small/").exists())
                    new File(UploadPath+"QualificationPermit/"+"small/").mkdirs();
                double scale=1.0f;
                if(file2.getSize()>=800*1024)
                    scale=(800*1024f)/file2.getSize();
                Thumbnails.of(UploadPath+"QualificationPermit/Original/"+file2.getOriginalFilename()).scale(1f).outputQuality(scale).outputFormat("jpg").toFile(UploadPath+"QualificationPermit/"+"small/"+file2.getOriginalFilename());
                Thumbnails.of(UploadPath + "QualificationPermit/Original/" + file2.getOriginalFilename()).scale(1f).outputQuality(scale).outputFormat("jpg").toFile(UploadPath + "QualificationPermit/"+file2.getOriginalFilename());
                new File(UploadPath+"QualificationPermit/Original/"+file2.getOriginalFilename()).delete();
            }
            return ResultUtils.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResultUtils.error(1,"");
        } finally {
            if (out != null)
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }

    //保存基地展示的图片
    @ResponseBody
    @RequestMapping(value = "save_about_third")
    public Result save_about_third(HttpServletRequest request) {
        File file = new File(UploadPath);
        if (!file.exists())
            file.mkdir();
        File file1 = new File(UploadPath + "Basedisplay");
        if (!file1.exists())
            file1.mkdir();
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles(("files[]"));
        MultipartFile file2 = null;
        FileOutputStream out = null;
        try {
            for (int i = 0; i < files.size(); i++) {
                file2 = files.get(i);
                if(!new File(UploadPath + "Basedisplay/Original/").exists())
                    new File(UploadPath + "Basedisplay/Original/").mkdirs();
                out = new FileOutputStream(new File(UploadPath + "Basedisplay/Original/", file2.getOriginalFilename()), false);
                byte[] bytes = file2.getBytes();
                out.write(bytes);
                if(!new File(UploadPath+"Basedisplay/"+"small/").exists())
                    new File(UploadPath+"Basedisplay/"+"small/").mkdirs();
                Thumbnails.of(UploadPath+"Basedisplay/Original/"+file2.getOriginalFilename()).scale(1f).outputQuality((30*1024f)/file2.getSize()).outputFormat("jpg").toFile(UploadPath+"Basedisplay/"+"small/"+file2.getOriginalFilename());
                double scale=1.0f;
                if(file2.getSize()>=800*1024)
                    scale=(800*1024f)/file2.getSize();
                Thumbnails.of(UploadPath + "Basedisplay/Original/" + file2.getOriginalFilename()).scale(1f).outputQuality(scale).outputFormat("jpg").toFile(UploadPath + "Basedisplay/"+file2.getOriginalFilename());
                new File(UploadPath+"Basedisplay/Original/"+file2.getOriginalFilename()).delete();
            }
            return ResultUtils.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResultUtils.error(1,"");
        } finally {
            if (out != null)
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }
    //保存蛙苗图片
    @ResponseBody
    @RequestMapping(value = "save_ProductCenter_one")
    public Result save_ProductCenter_one(HttpServletRequest request) {
        File file = new File(UploadPath);
        if (!file.exists())
            file.mkdir();
        File file1 = new File(UploadPath + "FrogSeedling/image/");
        if (!file1.exists())
            file1.mkdirs();
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles(("files[]"));
        MultipartFile file2 = null;
        FileOutputStream out = null;
        try {
            for (int i = 0; i < files.size(); i++) {
                file2 = files.get(i);
                if(!new File(UploadPath + "FrogSeedling/image/Original/").exists())
                    new File(UploadPath + "FrogSeedling/image/Original/").mkdirs();
                out = new FileOutputStream(new File(UploadPath + "FrogSeedling/image/Original/", file2.getOriginalFilename()), false);
                byte[] bytes = file2.getBytes();
                out.write(bytes);
                if(!new File(UploadPath+"FrogSeedling/image/"+"small/").exists())
                    new File(UploadPath+"FrogSeedling/image/"+"small/").mkdirs();
                Thumbnails.of(UploadPath+"FrogSeedling/image/Original/"+file2.getOriginalFilename()).scale(1f).outputQuality((30*1024f)/file2.getSize()).outputFormat("jpg").toFile(UploadPath+"FrogSeedling/image/"+"small/"+file2.getOriginalFilename());
                double scale=1.0f;
                if(file2.getSize()>=800*1024)
                    scale=(800*1024f)/file2.getSize();
                Thumbnails.of(UploadPath + "FrogSeedling/image/Original/" + file2.getOriginalFilename()).scale(1f).outputQuality(scale).outputFormat("jpg").toFile(UploadPath + "FrogSeedling/image/"+file2.getOriginalFilename());
                new File(UploadPath+"FrogSeedling/image/Original/"+file2.getOriginalFilename()).delete();
            }
            return ResultUtils.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResultUtils.error(1,"");
        } finally {
            if (out != null)
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }
    //保存成蛙图片
    @ResponseBody
    @RequestMapping(value = "save_ProductCenter_second")
    public Result save_ProductCenter_two(HttpServletRequest request) {
        File file = new File(UploadPath);
        if (!file.exists())
            file.mkdir();
        File file1 = new File(UploadPath + "AdultFrog/image/");
        if (!file1.exists())
            file1.mkdirs();
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles(("files[]"));
        MultipartFile file2 = null;
        FileOutputStream out = null;
        try {
            for (int i = 0; i < files.size(); i++) {
                file2 = files.get(i);
                if(!new File(UploadPath + "AdultFrog/image/Original/").exists())
                    new File(UploadPath + "AdultFrog/image/Original/").mkdirs();
                out = new FileOutputStream(new File(UploadPath + "AdultFrog/image/Original/", file2.getOriginalFilename()), false);
                byte[] bytes = file2.getBytes();
                out.write(bytes);
                if(!new File(UploadPath+"AdultFrog/image/"+"small/").exists())
                    new File(UploadPath+"AdultFrog/image/"+"small/").mkdirs();
                Thumbnails.of(UploadPath+"AdultFrog/image/Original/"+file2.getOriginalFilename()).scale(1f).outputQuality((30*1024f)/file2.getSize()).outputFormat("jpg").toFile(UploadPath+"AdultFrog/image/"+"small/"+file2.getOriginalFilename());
                  double scale=1.0f;
                if(file2.getSize()>=800*1024)
                   scale=(800*1024f)/file2.getSize();
                Thumbnails.of(UploadPath + "AdultFrog/image/Original/" + file2.getOriginalFilename()).scale(1f).outputQuality(scale).outputFormat("jpg").toFile(UploadPath + "AdultFrog/image/"+file2.getOriginalFilename());
                new File(UploadPath+"AdultFrog/image/Original/"+file2.getOriginalFilename()).delete();
            }
            return ResultUtils.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResultUtils.error(1,"");
        } finally {
            if (out != null)
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }
    //保存种蛙图片
    @ResponseBody
    @RequestMapping(value = "save_ProductCenter_third")
    public Result save_ProductCenter_third(HttpServletRequest request) {
        File file = new File(UploadPath);
        if (!file.exists())
            file.mkdir();
        File file1 = new File(UploadPath + "Frog/image/");
        if (!file1.exists())
            file1.mkdirs();
        List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles(("files[]"));
        MultipartFile file2 = null;
        FileOutputStream out = null;
        try {
            for (int i = 0; i < files.size(); i++) {
                file2 = files.get(i);
                if(!new File(UploadPath + "Frog/image/Original/").exists())
                    new File(UploadPath + "Frog/image/Original/").mkdirs();
                out = new FileOutputStream(new File(UploadPath + "Frog/image/Original/", file2.getOriginalFilename()), false);
                byte[] bytes = file2.getBytes();
                out.write(bytes);
                if(!new File(UploadPath+"Frog/image/"+"small/").exists())
                    new File(UploadPath+"Frog/image/"+"small/").mkdirs();
                Thumbnails.of(UploadPath+"Frog/image/Original/"+file2.getOriginalFilename()).scale(1f).outputQuality((30*1024f)/file2.getSize()).outputFormat("jpg").toFile(UploadPath+"Frog/image/"+"small/"+file2.getOriginalFilename());
                double scale=1.0f;
                if(file2.getSize()>=800*1024)
                    scale=(800*1024f)/file2.getSize();
                Thumbnails.of(UploadPath + "Frog/image/Original/" + file2.getOriginalFilename()).scale(1f).outputQuality(scale).outputFormat("jpg").toFile(UploadPath + "Frog/image/"+file2.getOriginalFilename());
                new File(UploadPath+"Frog/image/Original/"+file2.getOriginalFilename()).delete();
            }

            return ResultUtils.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResultUtils.error(1,"");
        } finally {
            if (out != null)
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
    }
    //保存上传的主页视频
    @ResponseBody
    @RequestMapping(value="save_upload_video")
    public Result save_upload_video(HttpServletRequest request)
    {
        File file=new File(UploadPath+"indexVideo/");
        if(!file.exists())
            file.mkdirs();
        List<MultipartFile> files=((MultipartHttpServletRequest)request).getFiles("files[]");
        MultipartFile file2=null;
        FileOutputStream out=null;
        try{
         for(int i=0;i<files.size();i++){
             file2=files.get(i);
            out=new FileOutputStream(UploadPath+"indexVideo/"+file2.getOriginalFilename(),false);
            out.write(file2.getBytes());
         }
         return ResultUtils.success();
        }
        catch (Exception e){
            e.printStackTrace();
           return  ResultUtils.error(1,"上传视频失败");
        }finally {
            if(out!=null){
                try{
                    out.close();
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }

    }

    //保存产品中心的描述
    /**
     * @param type
     * 0表示保存蛙苗描述
     * 1表示保存成蛙描述
     * 2表示保存种蛙描述
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "save_ProductCenterfile")
    public Result save_ProductCenterfile(@RequestParam("type") int type, @RequestParam("content") String content) {
        List<String> filesDirecory = new ArrayList<String>();
        filesDirecory.add("FrogSeedling/file/");
        filesDirecory.add("AdultFrog/file/");
        filesDirecory.add("Frog/file/");
        if(type>=filesDirecory.size())
            return ResultUtils.error(1,"输入的类型不对");
        if(content=="")
            return ResultUtils.error(2,"描述内容不能为空");
        File file=new File(UploadPath+filesDirecory.get(type));
        if(!file.exists())
            file.mkdirs();
        File file1=new File(UploadPath+filesDirecory.get(type)+"describe.txt");
        FileOutputStream out=null;
        try {
            out=new FileOutputStream(file1,false);
            out.write(content.getBytes());
            out.flush();
            return ResultUtils.success();
        }catch (Exception e){
            e.printStackTrace();
            return ResultUtils.error(3,"保存失败");
        }finally {
            if(out!=null){
                try{
                    out.close();
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
    }

    //获取上传的主页视频
    @ResponseBody
    @RequestMapping(value="get_upload_video")
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

    //获取产品中心的描述
    /**
     * @param type
     * 0表示获取蛙苗描述
     * 1表示获取成蛙描述
     * 2表示获取种蛙描述
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "get_ProductCenterfile")
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
    @RequestMapping(value = "get_filepath")
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
                    if(!new File(UploadPath+path+"small/"+file1.getName()).exists())
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

    //删除一个文件

    /**
     * @param path
     * 删除图片：path为图片的src地址
     *删除文件：path为文件的相对地址
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "delete_one_file")
    public Result delete_one_file(@RequestParam("path") String path) {
        JSONObject json = new JSONObject();
        File file=new File(UploadPath+path);
        if(!file.exists()){
          return   ResultUtils.error(1,"");
        }
        else if(file.isDirectory()){
            return   ResultUtils.error(2,"");
        }
        else{
                 String pre=path.substring(0,path.lastIndexOf("/")-5);
                 String name=path.substring(path.lastIndexOf("/")+1,path.length());
                 String path1=UploadPath+pre+name;
                 if(new File(path1).exists())
                 new File(path1).delete();
                 if(new File(UploadPath+pre+"Original/"+name).exists()){
                     new File(UploadPath+pre+"Original/"+name).delete();
                 }
                 if(file.delete()==true)
                     return   ResultUtils.success();
                 else
                     return   ResultUtils.error(3,"");

        }
    }

    //公司动态添加一条文章
    @ResponseBody
    @RequestMapping(value="add_one_CompanyDynamics")
    public Result<CompanyDynamics>  add_one_CompanyDynamics(@RequestParam("title") String title, @RequestParam("content") String content){

        if(title.contentEquals("")){
            return ResultUtils.error(1,"标题不能为空");
        }else if(title.length()>30){
            return ResultUtils.error(2,"标题长度最大为30");
        }
        if(content.contentEquals("")){
            return ResultUtils.error(3,"文章内容不能为空");
        }
        CompanyDynamics companyDynamics=new CompanyDynamics(title);
        Integer id=companyDynamicsService.get_one_id();
        companyDynamics.setPath(id+".txt");

        CompanyDynamics companyDynamics1=companyDynamicsService.InsertOneCompanyDynamics(companyDynamics);
        if(companyDynamics1==null){
            return ResultUtils.error(4,"插入数据失败");
        }
        String path=companyDynamics1.getPath();
        File file=new File(UploadPath);
        if(!file.exists())
            file.mkdir();
        File file1=new File(UploadPath+"CompanyDynamics");
        if(!file1.exists())
            file1.mkdir();
        File file2=new File(UploadPath+"CompanyDynamics/"+path);
        FileOutputStream out=null;
        try{
            out=new FileOutputStream(file2,false);
            out.write(content.getBytes());
            out.flush();
            return  ResultUtils.success(companyDynamics1);
        }catch (Exception e){
            companyDynamicsService.deleteOneById(companyDynamics1.getId());
            e.printStackTrace();
            return ResultUtils.error(5,e.getMessage());

        }finally {
            if(out!=null)
                try {
                    out.close();
                }catch (Exception e){
                    e.printStackTrace();
                }

        }
    }
    //获取公司动态的所有文章标题和ID
    @ResponseBody
    @RequestMapping(value="get_all_CompanyDynamics_title")
    public Result get_all_CompanyDynamics_title(){
        return  ResultUtils.success(companyDynamicsService.getAllCompanyDynamics());
    }
    //获取公司动态对应文章id的内容
    @ResponseBody
    @RequestMapping(value="get_CompanyDynamics_contentByID")
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
    //修改公司动态中的对应id的文章标题
    @ResponseBody
    @PutMapping(value="update_CompanyDynamics_tilteById")
    public  Result update_CompanyDynamics_tilteById(@RequestParam("id") Integer id,@RequestParam("title") String title)
    {
        if(companyDynamicsService.is_exist_id(id)==false)
            return ResultUtils.error(1,"对应id为"+id+"的文章不存在");
        else if(companyDynamicsService.is_exist_title(title)==true)
            return ResultUtils.error(2,"标题已存在");
        else if(title.contentEquals("")==true){
            return  ResultUtils.error(3,"标题不能为空");

        }else if(companyDynamicsService.UpdateTitleById(id,title)==false){
            return ResultUtils.error(4,"修改失败");
        }else{
            return  ResultUtils.success();
        }
    }
    //删除公司动态中对应id的文章
    @ResponseBody
    @DeleteMapping(value="delete_one_companyDynamicsById/{id}")
    public Result  delete_one_companyDynamicsById(@PathVariable("id") Integer id){
        if(companyDynamicsService.is_exist_id(id)==false)
            return ResultUtils.error(1,"对应id为"+id+"的文章不存在");
        else{
            String path=companyDynamicsService.getPathById(id);
            if(path==null)
            { companyDynamicsService.deleteOneById(id);
                return ResultUtils.success();
            }
            else{
                File file=new File(UploadPath+"CompanyDynamics/"+path);
                if(!file.exists()){
                    companyDynamicsService.deleteOneById(id);
                    return ResultUtils.success();
                }else{
                    file.delete();
                    companyDynamicsService.deleteOneById(id);
                    return ResultUtils.success();
                }
            }
        }

    }
    //删除公司对应ID数组的文章
    @ResponseBody
    @RequestMapping(value="delete_many_companyDynamicsById")
    public Result delete_many_companyDynamicsById(@RequestParam("id") String Id){
        String[] array=Id.split(",");
        List<Integer> id=new ArrayList<>();
        for(String i :array){
            id.add(Integer.parseInt(i));
        }
        if(id.size()==0){
            return ResultUtils.error(1,"请选中标题");
        }
        else
        if(companyDynamicsService.is_exist_ListID(id)==false){
            return ResultUtils.error(2,"选中的标题不存在");
        }else{
            List<String> path=companyDynamicsService.getListPathById(id);
            for(int j=0;j<path.size();j++){
                File file=new File(UploadPath+"CompanyDynamics/"+path.get(j));
                if(!file.exists()){

                }else{
                    file.delete();
                }
            }
            companyDynamicsService.deleteanyById(id);
            return ResultUtils.success();
        }

    }
    //修改公司动态中对应id的文章内容
    @ResponseBody
    @PutMapping(value="update_one_companyDynamics_contentByID")
    public Result update_one_companyDynamics_contentByID(@RequestParam("id") Integer id,@RequestParam("content") String content)
    { if(companyDynamicsService.is_exist_id(id)==false)
        return ResultUtils.error(1,"对应id为"+id+"的文章不存在");
    else if(content.contentEquals("")==true){
        return ResultUtils.error(2,"文章内容不能为空");
    }else{
        String path=companyDynamicsService.getPathById(id);
        if(path==null)
            return  ResultUtils.error(3,"文章路径不存在");
        else{
            File file=new File(UploadPath+"CompanyDynamics/"+path);
            FileOutputStream out=null;
            try{
                out=new FileOutputStream(file,false);
                out.write(content.getBytes());
                out.flush();
                return ResultUtils.success();
            }catch (Exception e){
                return ResultUtils.error(4,"修改失败");
            }finally {
                if(out!=null)
                    try{
                        out.close();
                    }catch (Exception ex){
                        ex.printStackTrace();
                    }
            }

        }
    }

    }



    //常见问题添加一条文章
    @ResponseBody
    @RequestMapping(value="add_one_CommonProblem")
    public Result<CommonProblem>  add_one_CommonProblem(@RequestParam("title") String title, @RequestParam("content") String content){

        if(title.contentEquals("")){
            return ResultUtils.error(1,"标题不能为空");
        }else if(title.length()>30){
            return ResultUtils.error(2,"标题长度最大为30");
        }
        if(content.contentEquals("")){
            return ResultUtils.error(3,"文章内容不能为空");
        }
        CommonProblem commonProblem=new CommonProblem(title);
        Integer id=commonProblemService.get_one_id();
        commonProblem.setPath(id+".txt");

        CommonProblem commonProblem1=commonProblemService.InsertOneCommonProblem(commonProblem);
        if(commonProblem1==null){
            return ResultUtils.error(4,"插入数据失败");
        }
        String path=commonProblem1.getPath();
        File file=new File(UploadPath);
        if(!file.exists())
            file.mkdir();
        File file1=new File(UploadPath+"CommonProblem");
        if(!file1.exists())
            file1.mkdir();
        File file2=new File(UploadPath+"CommonProblem/"+path);
        FileOutputStream out=null;
        try{
            out=new FileOutputStream(file2,false);
            out.write(content.getBytes());
            out.flush();
            return  ResultUtils.success(commonProblem1);
        }catch (Exception e){
            commonProblemService.deleteOneById(commonProblem1.getId());
            e.printStackTrace();
            return ResultUtils.error(5,e.getMessage());

        }finally {
            if(out!=null)
                try {
                    out.close();
                }catch (Exception e){
                    e.printStackTrace();
                }
        }
    }
    //获取常见问题的所有文章标题和ID
    @ResponseBody
    @RequestMapping(value="get_all_CommonProblem_title")
    public Result get_all_CommonProblem_title(){
        return ResultUtils.success(commonProblemService.getAllCommonProblem());
    }
    //获取常见问题对应文章id的内容
    @ResponseBody
    @RequestMapping(value="get_CommonProblem_contentByID")
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
    //修改常见问题中的对应id的文章标题
    @ResponseBody
    @PutMapping(value="update_CommonProblem_tilteById")
    public  Result update_CommonProblem_tilteById(@RequestParam("id") Integer id,@RequestParam("title") String title)
    {
        if(commonProblemService.is_exist_id(id)==false)
            return ResultUtils.error(1,"对应id为"+id+"的文章不存在");
        else if(commonProblemService.is_exist_title(title)==true)
            return ResultUtils.error(2,"标题已存在");
        else if(title.contentEquals("")==true){
            return  ResultUtils.error(3,"标题不能为空");

        }else if(commonProblemService.UpdateTitleById(id,title)==false){
            return ResultUtils.error(4,"修改失败");
        }else{
            return  ResultUtils.success();
        }
    }
    //删除常见问题中对应id的文章
    @ResponseBody
    @DeleteMapping(value="delete_one_CommonProblemById/{id}")
    public Result  delete_one_CommonProblemById(@PathVariable("id") Integer id){
        if(commonProblemService.is_exist_id(id)==false)
            return ResultUtils.error(1,"对应id为"+id+"的文章不存在");
        else{
            String path=commonProblemService.getPathById(id);
            if(path==null)
            { commonProblemService.deleteOneById(id);
                return ResultUtils.success();
            }
            else{
                File file=new File(UploadPath+"CommonProblem/"+path);
                if(!file.exists()){
                    commonProblemService.deleteOneById(id);
                    return ResultUtils.success();
                }else{
                    file.delete();
                    commonProblemService.deleteOneById(id);
                    return ResultUtils.success();
                }
            }
        }

    }
    //删除常见问题对应ID数组的文章
    @ResponseBody
    @RequestMapping(value="delete_many_CommonProblemById")
    public Result delete_many_CommonProblemById(@RequestParam("id") String Id){
        String[] array=Id.split(",");
        List<Integer> id=new ArrayList<>();
        for(String i :array){
            id.add(Integer.parseInt(i));
        }
        if(id.size()==0){
            return ResultUtils.error(1,"请选中标题");
        }
        else
        if(commonProblemService.is_exist_ListID(id)==false){
            return ResultUtils.error(2,"选中的标题不存在");
        }else{
            List<String> path=commonProblemService.getListPathById(id);
            for(int j=0;j<path.size();j++){
                File file=new File(UploadPath+"CommonProblem/"+path.get(j));
                if(!file.exists()){

                }else{
                    file.delete();
                }
            }
            commonProblemService.deleteanyById(id);
            return ResultUtils.success();
        }

    }
    //修改常见问题中对应id的文章内容
    @ResponseBody
    @PutMapping(value="update_one_CommonProblem_contentByID")
    public Result update_one_CommonProblem_contentByID(@RequestParam("id") Integer id,@RequestParam("content") String content)
    { if(commonProblemService.is_exist_id(id)==false)
        return ResultUtils.error(1,"对应id为"+id+"的文章不存在");
    else if(content.contentEquals("")==true){
        return ResultUtils.error(2,"文章内容不能为空");
    }else{
        String path=commonProblemService.getPathById(id);
        if(path==null)
            return  ResultUtils.error(3,"文章路径不存在");
        else{
            File file=new File(UploadPath+"CommonProblem/"+path);
            FileOutputStream out=null;
            try{
                out=new FileOutputStream(file,false);
                out.write(content.getBytes());
                out.flush();
                return ResultUtils.success();
            }catch (Exception e){
                return ResultUtils.error(4,"修改失败");
            }finally {
                if(out!=null)
                    try{
                        out.close();
                    }catch (Exception ex){
                        ex.printStackTrace();
                    }
            }

        }
    }

    }

    //添加联系我们的信息到数据库
    @ResponseBody
    @RequestMapping(value="addContact")
    public Result addContact(@Valid Contact contact, BindingResult bindingResult)
    {if(bindingResult.hasErrors())
        return ResultUtils.error(1,bindingResult.getFieldError().getDefaultMessage());
    else
    { if(contactService.saveContact(contact)==true)
        return ResultUtils.success();
    else
        return ResultUtils.error(2,"添加失败");
    }
    }
    //获取联系信息
    @ResponseBody
    @RequestMapping(value="getContact")
    public Result getContact(){
        return ResultUtils.success(contactService.getContact());
    }
    //分页获取客户实例
    @ResponseBody
    @RequestMapping(value="GetCustomerInstancesBypage")
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


    //分页获取客户评价
    @ResponseBody
    @RequestMapping(value="GetCustomerEvaluationsBypage")
    public Result GetCustomerEvaluationsBypage(@RequestParam("page") int page,@RequestParam("size") int size)
    {
        Page<CustomerInstance> page1=customerInstanceService.GetCustomerInstancesBypage(page,size,0);
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
    //获取经过审核的客户实例个数
    @ResponseBody
    @RequestMapping(value="getCountCustomerInstancesByType")
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
    //获取客户评价的个数
    @ResponseBody
    @RequestMapping(value="getCountCustomerEvaluationsByType")
    public Result getCountCustomerEvaluationsByType()
    {    Integer number=customerInstanceService.getCountCustomerInstancesByType(0);
        if(number==0)
        {
            return  ResultUtils.error(1,"客户评价数量为空");
        }
        else{
            return  ResultUtils.success(number);
        }
    }
    //删除某个用户实例或者客户评价
    @ResponseBody
    @RequestMapping(value="deleteOneCustomerInstance")
    public Result deleteOneCustomerInstance(@RequestParam("id") Integer id){
        CustomerInstance customerInstance=customerInstanceService.findOneCustomerInstanceById(id);
        if(customerInstance==null)
            return ResultUtils.error(1,"此客户实例不存在");
        else{
            String img=customerInstance.getImage().trim();
            String path=customerInstance.getPath().trim();
            if(img.contentEquals("img/customerimage.jpg")==false){
                File file=new File(UploadPath+img);
                if(!file.exists()){

                }else {
                    file.delete();
                }
            }
            File file1=new File(UploadPath+"CustomerInstance/evaluate/"+path);
            if(!file1.exists()){

            }else{
                file1.delete();
            }
            customerInstanceService.deleteOneCustomerInstanceById(id);
            return ResultUtils.success();
        }
    }
    //客户评价通过审核
    @ResponseBody
    @RequestMapping(value="setOneCustomerEvaluationType")
    public Result setOneCustomerEvaluationType(@RequestParam("id") Integer id){
        CustomerInstance customerInstance=customerInstanceService.findOneCustomerInstanceById(id);
        if(customerInstance==null)
            return ResultUtils.error(1,"此客户评价不存在");
        else{
            if(customerInstanceService.setOneCustomerEvaluationType(id)==true)
                return ResultUtils.success();
            else {
                return  ResultUtils.error(2,"通过审核失败");
            }
        }
    }
     //获取客服
    @ResponseBody
    @RequestMapping(value="getCustomerService")
    public Result getCustomerService(){
        CustomerService customerService=customerServiceService.findOneCustomerService();
        if(customerService==null)
            return ResultUtils.error(1,"无客服账号记录");
        else
            return ResultUtils.success(customerService);

    }
    //删除客服
   @ResponseBody
   @RequestMapping(value="deleteOneCustomerSerivce")
   public Result deleteOneCustomerSerivce(@RequestParam("username") String username){
        customerServiceService.deleteCustomer(username);
        return ResultUtils.success();
   }
//  添加客服
    @ResponseBody
    @RequestMapping(value="addOneCustomerService")
    public Result addOneCustomerService(@Valid CustomerService customerService,BindingResult bindingResult)
    {
        if(bindingResult.hasErrors()){
            return ResultUtils.error(1,bindingResult.getFieldError().getDefaultMessage());
        }else
        {
            Integer id=customerServiceService.addOneCustomerService(customerService);
            if(id==-1)
                return  ResultUtils.error(2,"添加客服失败");
            else
                return ResultUtils.success(id);
        }
    }
    //更新客服
    @ResponseBody
    @RequestMapping(value="UpdateOneCustomerService")
    public Result UpdateOneCustomerService(@RequestParam("id") Integer id,@RequestParam("username") String username,@RequestParam("password") String password)
    {       if(customerServiceService.isExistById(id)==false){
        return ResultUtils.error(1,"此客服不存在");
    }else{
        CustomerService customerService=new CustomerService(username,password);
        customerService.setId(id);
        if( customerServiceService.UpdateCustomer(customerService)==false)
            return  ResultUtils.error(2,"更新客服信息失败");
        else
            return ResultUtils.success();
    }


    }
}
