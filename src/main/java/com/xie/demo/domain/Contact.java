package com.xie.demo.domain;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * MR.XIE
 * 2018/5/5 15:57
 * 联系我们
 **/
@Entity
@Table(name="Contact")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull(message = "企业名称不能为空")
    @Length(min=1,max=40,message = "企业名称的长度最大为40")
    private String BussinessName;
    @NotNull(message="省份不能为空")
    private String provine;
    @NotNull(message="市不能为空")
    private String city;
    @NotNull(message="区不能为空")
    private String area;
    @NotNull(message="详细地址不能为空")
    @Length(min=1,max=100,message = "详细地址的长度最大为100")
    private String DetailedAddress;
    @NotNull(message="手机号码不能为空")
    @Length(min=11,max=11,message="手机号码错误")
    private String telPhone;
    @Length(min=11,max=11,message="备份手机号码错误")
    private String SpareTelPhone;
    @NotNull(message="联系人姓名必须填写")
    @Length(min=2,max=40,message = "联系人姓名长度最小为1最大为40")
    private String BusinessBoss;

    public Contact() {
    }

    public String getBussinessName() {
        return BussinessName;
    }

    public void setBussinessName(String bussinessName) {
        BussinessName = bussinessName;
    }

    public String getProvine() {
        return provine;
    }

    public void setProvine(String provine) {
        this.provine = provine;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getDetailedAddress() {
        return DetailedAddress;
    }

    public void setDetailedAddress(String detailedAddress) {
        DetailedAddress = detailedAddress;
    }

    public String getTelPhone() {
        return telPhone;
    }

    public void setTelPhone(String telPhone) {
        this.telPhone = telPhone;
    }

    public String getSpareTelPhone() {
        return SpareTelPhone;
    }

    public void setSpareTelPhone(String spareTelPhone) {
        SpareTelPhone = spareTelPhone;
    }

    public String getBusinessBoss() {
        return BusinessBoss;
    }

    public void setBusinessBoss(String businessBoss) {
        BusinessBoss = businessBoss;
    }

    public Integer getId() {
        return id;
    }

    public Contact(@NotNull(message = "企业名称不能为空") @Length(min = 1, max = 40, message = "企业名称的长度最大为40") String bussinessName, @NotNull(message = "省份不能为空") String provine, @NotNull(message = "市不能为空") String city, @NotNull(message = "区不能为空") String area, @NotNull(message = "详细地址不能为空") @Length(min = 1, max = 100, message = "详细地址的长度最大为100") String detailedAddress, @NotNull(message = "手机号码不能为空") @Length(min = 11, max = 11, message = "手机号码错误") String telPhone, @Length(min = 11, max = 11, message = "手机号码错误") String spareTelPhone, @NotNull(message = "联系人姓名必须填写") @Length(min = 2, max = 40, message = "联系人姓名长度最小为1最大为40") String businessBoss) {
        BussinessName = bussinessName;
        this.provine = provine;
        this.city = city;
        this.area = area;
        DetailedAddress = detailedAddress;
        this.telPhone = telPhone;
        SpareTelPhone = spareTelPhone;
        BusinessBoss = businessBoss;
    }

    public Contact(@NotNull(message = "企业名称不能为空") @Length(min = 1, max = 40, message = "企业名称的长度最大为40") String bussinessName, @NotNull(message = "省份不能为空") String provine, @NotNull(message = "市不能为空") String city, @NotNull(message = "区不能为空") String area, @NotNull(message = "详细地址不能为空") @Length(min = 1, max = 100, message = "详细地址的长度最大为100") String detailedAddress, @NotNull(message = "手机号码不能为空") @Length(min = 11, max = 11, message = "手机号码错误") String telPhone, @NotNull(message = "联系人姓名必须填写") @Length(min = 2, max = 40, message = "联系人姓名长度最小为1最大为40") String businessBoss) {
        BussinessName = bussinessName;
        this.provine = provine;
        this.city = city;
        this.area = area;
        DetailedAddress = detailedAddress;
        this.telPhone = telPhone;
        BusinessBoss = businessBoss;
    }

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", BussinessName='" + BussinessName + '\'' +
                ", provine='" + provine + '\'' +
                ", city='" + city + '\'' +
                ", area='" + area + '\'' +
                ", DetailedAddress='" + DetailedAddress + '\'' +
                ", telPhone='" + telPhone + '\'' +
                ", SpareTelPhone='" + SpareTelPhone + '\'' +
                ", BusinessBoss='" + BusinessBoss + '\'' +
                '}';
    }
}
