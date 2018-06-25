package com.xie.demo.domain;

/**
 * MR.XIE
 * 2018/4/7 22:32
 **/
public class User {
    private String username;
    private  String email;
private  String code;
private int result=0;//判断邮箱验证码是否输入正确
    private int update=0;//判断密码是否重置成功
    public User() {
    }

    public int getUpdate() {
        return update;
    }

    public void setUpdate(int update) {
        this.update = update;
    }

    public int getResult() {
        return result;
    }

    public void setResult(int result) {
        this.result = result;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "User{" +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", code='" + code + '\'' +
                ", result=" + result +
                '}';
    }
}
