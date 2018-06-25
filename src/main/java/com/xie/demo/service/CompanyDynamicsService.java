package com.xie.demo.service;

import com.xie.demo.domain.CompanyDynamics;
import com.xie.demo.respository.CompanyDynamicsResposity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * MR.XIE
 * 2018/4/30 14:47
 * 操作公司动态表
 **/
@Service
public class CompanyDynamicsService {
    @Autowired
    private CompanyDynamicsResposity companyDynamicsResposity;


    public List<CompanyDynamics> getAllCompanyDynamics()
    {
        return companyDynamicsResposity.findAll(new Sort(Sort.Direction.DESC,"id"));
    }

    //添加一条数据,返回插入的文章ID
    @Transactional
    public CompanyDynamics InsertOneCompanyDynamics(CompanyDynamics companyDynamics) {
       return companyDynamicsResposity.save(companyDynamics);
    }
    //得到一个文章的id
    public Integer get_one_id(){
        List<CompanyDynamics> list=companyDynamicsResposity.findAll(new Sort(Sort.Direction.DESC,"id"));
        if(list.size()==0)
            return 1;
        else
            return list.get(0).getId()+1;
    }
    //删除一条数据
    @Transactional
    public void deleteOneById(Integer id)
    {
        companyDynamicsResposity.deleteById(id);
    }
    //批量删除数据通过ID
    @Transactional
    public void deleteanyById(List<Integer> id)
    {
        List<CompanyDynamics> companyDynamics=companyDynamicsResposity.findAllById(id);
        companyDynamicsResposity.deleteAll(companyDynamics);
    }

    //判断对应的ID是否存在
    public boolean is_exist_id(Integer id){
        return companyDynamicsResposity.existsById(id);
    }
    //判断对应的id数组是否存在
    public boolean is_exist_ListID(List<Integer> id){
        List<CompanyDynamics> companyDynamics=companyDynamicsResposity.findAllById(id);
        if(id.size()==companyDynamics.size())
            return true;
        else
            return false;
    }
    //判断对应的title是否存在
    public boolean is_exist_title(String title){
        return companyDynamicsResposity.existsByTitle(title);
    }
    //修改标题
    @Transactional
    public boolean UpdateTitleById(Integer id,String title)
    {
        CompanyDynamics companyDynamics=companyDynamicsResposity.findFirstById(id);
        companyDynamics.setTitle(title);
        if(companyDynamicsResposity.save(companyDynamics)!=null)
            return true;
        else
            return false;
    }
    //通过ID获取文章的相对路径
    public String  getPathById(Integer id){
          CompanyDynamics companyDynamics=companyDynamicsResposity.findFirstById(id);
          if(companyDynamics==null)
              return null;
          else
              return companyDynamics.getPath();
    }
    //获取ID数组对应的文章路径的数组
    public List<String> getListPathById(List<Integer> id){
        List<CompanyDynamics> companyDynamics=companyDynamicsResposity.findAllById(id);
        List<String> path=new ArrayList<>();
        for(int i=0;i<companyDynamics.size();i++){
            path.add(companyDynamics.get(i).getPath());
        }
        return path;
    }


}
