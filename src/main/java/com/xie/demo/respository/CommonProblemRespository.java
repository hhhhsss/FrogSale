package com.xie.demo.respository;

import com.xie.demo.domain.CommonProblem;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * MR.XIE
 * 2018/5/4 21:55
 * 常见问题
 **/
public interface CommonProblemRespository extends JpaRepository<CommonProblem,Integer> {
    //通过ID获取数据
    public CommonProblem findFirstById(Integer id);
    //判断对应的id是否存在
    public boolean existsById(Integer id);
    //判断对应的title是否存在
    public boolean existsByTitle(String title);
}
