package com.xie.demo.domain;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * MR.XIE
 * 2018/4/30 10:43
 * 公司动态
 **/
@Entity
@Table(name="CompanyDynamics")
public class CompanyDynamics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    private String type="公司动态";
    @NotNull(message="标题不能为空")
    @Length(min=1,max=30,message="标题长度最小为1,最大为30")
    @Column(unique = true)//唯一键
    private String title;
    @Column(name="path",nullable = false,unique = true)
    private String path;

    public CompanyDynamics() {
    }

    public CompanyDynamics(@NotNull(message = "标题不能为空") @Length(min = 1, max = 30, message = "标题长度最小为1,最大为30") String title) {
        this.title = title;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPath() {
        return path;
    }

    public Integer getId() {
        return id;
    }


    @Override
    public String toString() {
        return "CompanyDynamics{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", title='" + title + '\'' +
                ", path='" + path + '\'' +
                '}';
    }
}
