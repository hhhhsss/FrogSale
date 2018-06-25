package com.xie.demo.respository;

import com.xie.demo.domain.Manger;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * MR.XIE
 * 2018/5/11 11:03
 * 管理员
 **/
public interface MangerResposity extends JpaRepository<Manger, Integer> {
    //判断用户名和密码是否存在
    public Manger findFirstByUsernameAndPassword(String username, String password);

    //判断用户名是否存在
    public Manger findFirstByUsername(String username);
}
