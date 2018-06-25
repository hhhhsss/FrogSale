package com.xie.demo.respository;

import com.xie.demo.domain.CompanyDynamics;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * MR.XIE
 * 2018/4/30 14:39
 * 公司动态
 **/
public interface CompanyDynamicsResposity  extends JpaRepository<CompanyDynamics,Integer> {
 //通过ID获取数据
    public CompanyDynamics findFirstById(Integer id);
    //判断对应的id是否存在
    public boolean existsById(Integer id);
    //判断对应的title是否存在
    public boolean existsByTitle(String title);

}
