package com.xie.demo.domain;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * MR.XIE
 * 2018/5/4 21:45
 * 常见问题
 **/
@Entity
@Table(name="CommonProblem")
public class CommonProblem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotNull
    private String type="常见问题";
    @NotNull(message="标题不能为空")
    @Length(min=1,max=30,message="标题长度最小为1,最大为30")
    @Column(unique = true)//唯一键
    private String title;
    @Column(name="path",nullable = false,unique = true)
    private String path;

    public CommonProblem() {
    }

    public CommonProblem(@NotNull(message = "标题不能为空") @Length(min = 1, max = 30, message = "标题长度最小为1,最大为30") String title) {
        this.title = title;
    }

    public Integer getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getPath() {
        return path;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "CommonProblem{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", title='" + title + '\'' +
                ", path='" + path + '\'' +
                '}';
    }
}
