package com.xie.demo.service;

import com.xie.demo.domain.CustomerInstance;
import com.xie.demo.respository.CustomerInstanceResposity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * MR.XIE
 * 2018/5/6 16:37
 * 客户实例
 **/
@Service
public class CustomerInstanceService {
    @Autowired
    private CustomerInstanceResposity customerInstanceResposity;
    //分页获(未)取经过审核的数据
    public Page<CustomerInstance> GetCustomerInstancesBypage(int page, int size,int type){
        Sort sort=new Sort(Sort.Direction.DESC,"id");
        Pageable pageable=new PageRequest(page,size,sort);
        return customerInstanceResposity.findAllByType(type,pageable);
    }

    //获取(未)经过审核的客户实例个数
    public Integer getCountCustomerInstancesByType(int type){
      return customerInstanceResposity.countAllByType(type);
    }
    //添加客户评价
    @Transactional
    public boolean addOneCustomerInstance(CustomerInstance customerInstance)
    {
        CustomerInstance customerInstance1=customerInstanceResposity.save(customerInstance);
        if(customerInstance1!=null)
            return true;
        else
            return  false;
    }
    //获取下个ID
    public Integer getNextId()
    {List<CustomerInstance> customerInstance=customerInstanceResposity.findAll(new Sort(Sort.Direction.DESC,"id"));
     if(customerInstance.size()==0)
         return 1;
     else
         return customerInstance.get(0).getId()+1;
    }
    //删除某个评价通过Id
    @Transactional
    public void deleteOneCustomerInstanceById(Integer id)
    {
        customerInstanceResposity.deleteById(id);
    }
    //通过ID获取一个客户实例
    public CustomerInstance findOneCustomerInstanceById(Integer id){
        return customerInstanceResposity.findFirstById(id);
    }
    //客户评价通过审核
    @Transactional
    public boolean setOneCustomerEvaluationType(Integer id){
        CustomerInstance customerInstance=customerInstanceResposity.findFirstById(id);
        if(customerInstance!=null){
            customerInstance.setType(1);
            if(customerInstanceResposity.save(customerInstance)!=null)
                return true;
            else
                return false;
        }else
            return false;
    }

}
