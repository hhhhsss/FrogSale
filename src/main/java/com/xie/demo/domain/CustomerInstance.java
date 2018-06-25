package com.xie.demo.domain;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * MR.XIE
 * 2018/5/6 15:06
 * 客户实例
 **/
@Entity
@Table(name="CustomerInstance")
public class CustomerInstance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "名字不能为空")
    @Length(min=1,max=40,message = "客户名称长度最小为1最大为40")
    private String name;
    @Length(min=11,max=11,message="手机号码错误")
    private String telPhone;
    @NotNull(message = "发布时间不能为空")
    private Date date;
    @NotNull(message="图片地址不能为空")
    private String image;
    @NotNull(message = "评价不能为空")
    private String path;

    @Range(min=0,max=1,message = "type最小值为0,最大值为1")
    private int type=0;//0为未审核 1位审核通过
    public CustomerInstance() {
    }

    public CustomerInstance(@NotNull(message = "名字不能为空") @Length(min = 1, max = 40, message = "客户名称长度最小为1最大为40") String name, @NotNull(message = "发布时间不能为空") Date date) {
        this.name = name;
        this.date = date;
    }

    public CustomerInstance(@NotNull(message = "名字不能为空") @Length(min = 1, max = 40, message = "客户名称长度最小为1最大为40") String name, @Length(min = 11, max = 11, message = "手机号码错误") String telPhone, @NotNull(message = "发布时间不能为空") Date date, String image, @NotNull(message = "评价不能为空") String path) {
        this.name = name;
        this.telPhone = telPhone;
        this.date = date;
        this.image = image;
        this.path = path;
    }

    public CustomerInstance(@NotNull(message = "名字不能为空") @Length(min = 1, max = 40, message = "客户名称长度最小为1最大为40") String name, @NotNull(message = "发布时间不能为空") Date date, String image, @NotNull(message = "评价不能为空") String path) {
        this.name = name;
        this.date = date;
        this.image = image;
        this.path = path;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTelPhone() {
        return telPhone;
    }

    public Date getDate() {
        return date;
    }

    public String getImage() {
        return image;
    }

    public String getPath() {
        return path;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTelPhone(String telPhone) {
        this.telPhone = telPhone;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "CustomerInstance{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", telPhone='" + telPhone + '\'' +
                ", date=" + date +
                ", image='" + image + '\'' +
                ", path='" + path + '\'' +
                ", type=" + type +
                '}';
    }
}
