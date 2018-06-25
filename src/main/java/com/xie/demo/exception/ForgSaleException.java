package com.xie.demo.exception;

import com.xie.demo.enums.ResultEnum;

/**
 * MR.XIE
 * 2018/5/12 11:17
 * 主要是用来访问权限的验证
 **/
public class ForgSaleException extends RuntimeException{
    private int code;

    public ForgSaleException(ResultEnum resultEnum){
        super(resultEnum.getMessage());
        this.code=resultEnum.getCode();
    }
    public int getCode() {
        return code;
    }
    public void setCode(int code) {
        this.code = code;
    }
}
