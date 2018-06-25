package com.xie.demo.service;

import com.xie.demo.domain.CustomerService;
import com.xie.demo.respository.CustomerServiceResposity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * MR.XIE
 * 2018/5/14 9:30
 * 客服表操作
 **/
@Service
public class CustomerServiceService {
    @Autowired
    private CustomerServiceResposity customerServiceResposity;
    //判断注册的客服用户名是否存在
    public boolean Is_existence_CustomerServiceUsername(String username){
     if(customerServiceResposity.findFirstByUsername(username)!=null)
         return true;
     else
         return false;
    }
    //判断登录的客服账号和密码是否正确
    public boolean findFirstByUsernameAndPassword(String username, String password){
      if(customerServiceResposity.findFirstByUsernameAndPassword(username,password)!=null)
          return true;
      else
          return false;
    }
    //获取客服
    public CustomerService findOneCustomerService(){
        List<CustomerService> customerServices=customerServiceResposity.findAll();
        if(customerServices.size()==0)
            return null;
        else
            return customerServices.get(0);
    }
   //删除客服
    @Transactional
    public void deleteCustomer(String username){
        customerServiceResposity.deleteByUsername(username);
    }
    //添加客服
    @Transactional
    public Integer addOneCustomerService(CustomerService customerService){
      CustomerService customerService1=customerServiceResposity.save(customerService);
      if(customerService1!=null)
          return customerService1.getId();
      else
          return -1;
    }
    //保存客服
    public boolean UpdateCustomer(CustomerService customerService){
        CustomerService customerService1=customerServiceResposity.save(customerService);
        if(customerService1!=null)
            return true;
        else
            return false;
    }
    //判断客服是否存在
    public boolean isExistById(Integer id){
        CustomerService customerService=customerServiceResposity.findFirstById(id);
        if(customerService!=null)
            return true;
        else
            return false;
    }
}
