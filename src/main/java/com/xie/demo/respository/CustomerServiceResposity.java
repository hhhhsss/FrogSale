package com.xie.demo.respository;

import com.xie.demo.domain.CustomerService;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * MR.XIE
 * 2018/5/14 9:26
 * 客服
 **/
public interface CustomerServiceResposity extends JpaRepository<CustomerService,Integer> {
    //判断注册的客服用户名是否存在
    public CustomerService findFirstByUsername(String username);
    //判断登录的客服账号和密码是否正确
    public CustomerService findFirstByUsernameAndPassword(String username,String password);
    //删除客服
    public void deleteByUsername(String username);
    //获取客服
    public CustomerService findFirstById(Integer id);

}
