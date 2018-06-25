package com.xie.demo.domain;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * MR.XIE
 * 2018/5/14 9:20
 * 客服信息表
 **/
@Entity
@Table(name="CustomerService")
public class CustomerService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "用户名不能为空")
    @Length(min = 4,max=8,message = "用户名最小4位数，最大8位数")
    @Column(unique = true)
    private String username;
    @NotNull(message="密码不能为空")
    @Length(min=6,max=18,message="密码最小为6位数，最大为18位数")
    private String password;

    public CustomerService() {
    }

    public CustomerService(@NotNull(message = "用户名不能为空") @Length(min = 4, max = 8, message = "用户名最小4位数，最大8位数") String username, @NotNull(message = "密码不能为空") @Length(min = 6, max = 18, message = "密码最小为6位数，最大为18位数") String password) {
        this.username = username;
        this.password = password;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "CustomerService{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
