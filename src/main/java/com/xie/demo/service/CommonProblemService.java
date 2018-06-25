package com.xie.demo.service;

import com.xie.demo.domain.CommonProblem;
import com.xie.demo.respository.CommonProblemRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * MR.XIE
 * 2018/5/4 21:57
 * 操作CommonProblem表
 **/
@Service
public class CommonProblemService {
 @Autowired
    private CommonProblemRespository commonProblemRespository;

    public List<CommonProblem> getAllCommonProblem()
    {
        return commonProblemRespository.findAll(new Sort(Sort.Direction.DESC,"id"));
    }

    //添加一条数据,返回插入的文章ID
    @Transactional
    public CommonProblem InsertOneCommonProblem(CommonProblem commonProblem) {
        return commonProblemRespository.save(commonProblem);
    }
    //得到一个文章的id
    public Integer get_one_id(){
        List<CommonProblem> list=commonProblemRespository.findAll(new Sort(Sort.Direction.DESC,"id"));
        if(list.size()==0)
            return 1;
        else
            return list.get(0).getId()+1;
    }
    //删除一条数据
    @Transactional
    public void deleteOneById(Integer id)
    {
        commonProblemRespository.deleteById(id);
    }
    //批量删除数据通过ID
    @Transactional
    public void deleteanyById(List<Integer> id)
    {
        List<CommonProblem> commonProblems=commonProblemRespository.findAllById(id);
        commonProblemRespository.deleteAll(commonProblems);
    }

    //判断对应的ID是否存在
    public boolean is_exist_id(Integer id){
        return commonProblemRespository.existsById(id);
    }
    //判断对应的id数组是否存在
    public boolean is_exist_ListID(List<Integer> id){
        List<CommonProblem> commonProblems=commonProblemRespository.findAllById(id);
        if(id.size()==commonProblems.size())
            return true;
        else
            return false;
    }
    //判断对应的title是否存在
    public boolean is_exist_title(String title){
        return commonProblemRespository.existsByTitle(title);
    }
    //修改标题
    @Transactional
    public boolean UpdateTitleById(Integer id,String title)
    {
        CommonProblem commonProblem=commonProblemRespository.findFirstById(id);
        commonProblem.setTitle(title);
        if(commonProblemRespository.save(commonProblem)!=null)
            return true;
        else
            return false;
    }
    //通过ID获取文章的相对路径
    public String  getPathById(Integer id){
        CommonProblem commonProblem=commonProblemRespository.findFirstById(id);
        if(commonProblem==null)
            return null;
        else
            return commonProblem.getPath();
    }
    //获取ID数组对应的文章路径的数组
    public List<String> getListPathById(List<Integer> id){
        List<CommonProblem> commonProblems=commonProblemRespository.findAllById(id);
        List<String> path=new ArrayList<>();
        for(int i=0;i<commonProblems.size();i++){
            path.add(commonProblems.get(i).getPath());
        }
        return path;
    }


}
