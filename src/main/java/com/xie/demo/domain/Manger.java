package com.xie.demo.domain;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

/**
 * MR.XIE
 * 2018/5/11 10:24
 * 管理员
 **/
@Entity
@Table(name="Manger")
public class Manger {
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
    @Email
    @NotNull(message="邮箱不能为空")
    private String email;

    public Manger() {
    }

    public Manger(@NotNull(message = "用户名不能为空") @Length(min = 4, max = 8, message = "用户名最小4位数，最大8位数") String username, @NotNull(message = "密码不能为空") @Length(min = 6, max = 18, message = "密码最小为6位数，最大为18位数") String password, @Email @NotNull(message = "邮箱不能为空") String email) {
        this.username = username;
        this.password = password;
        this.email = email;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Manger{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
