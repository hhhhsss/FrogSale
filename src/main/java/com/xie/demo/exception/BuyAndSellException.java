package com.xie.demo.exception;

import com.xie.demo.enums.ResultEnum;

public class BuyAndSellException  extends  RuntimeException{
    private Integer code;

    public BuyAndSellException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code =resultEnum.getCode();
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
}
