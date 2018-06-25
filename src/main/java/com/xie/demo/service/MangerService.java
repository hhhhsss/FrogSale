package com.xie.demo.service;

import com.xie.demo.domain.Manger;
import com.xie.demo.respository.MangerResposity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * MR.XIE
 * 2018/5/11 11:03
 * 操作管理员表
 **/
@Service
public class MangerService {
    @Autowired
    private MangerResposity mangerResposity;
    //判断用户名和密码是否存在
    public boolean confirm_UsernameAndPassword(String username,String password){
        Manger manger=mangerResposity.findFirstByUsernameAndPassword(username,password);
        if(manger==null)
            return false;
        else
            return true;
    }
    //判断用户名是否存在
    public boolean Is_existence_MangerByUsername(String name){
        if(mangerResposity.findFirstByUsername(name)!=null)
            return true;
        else
            return false;
    }
    //得到管理员的邮箱
    public String getEmailByUsername(String usernmae){
        Manger manger=mangerResposity.findFirstByUsername(usernmae);
        if(manger!=null)
            return manger.getEmail();
        else
            return null;
    }
    //更新密码
    @Transactional
    public boolean update_passwordByUsername(String username,String password){
        Manger manger=mangerResposity.findFirstByUsername(username);
        manger.setPassword(password);
        Manger manger1=mangerResposity.save(manger);
        if(manger1!=null)
            return true;
        else
            return false;
    }

}
