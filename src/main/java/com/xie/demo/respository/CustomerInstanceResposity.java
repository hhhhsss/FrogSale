package com.xie.demo.respository;

import com.xie.demo.domain.CustomerInstance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * MR.XIE
 * 2018/5/6 16:32
 * 客户实例
 **/
public interface CustomerInstanceResposity extends JpaRepository<CustomerInstance,Integer> {
    //分页获取数据
    public Page<CustomerInstance> findAllByType(Integer type, Pageable pageable);
   
    public Integer countAllByType(Integer type);
    //通过ID获取一个客户实例
    public  CustomerInstance findFirstById(Integer id);
    
}
