package com.xie.demo.enums;

public enum ResultEnum {
    UNKONW_ERROR(-1,"未知错误"),
    SUCCESS(0,"成功"),
    MangerBackgound_Visit_ERROR(-2,"没管理员后台访问权限"),
    CustomerSerive_Visit_ERROR(-3,"没有客服访问权限")
//    ERROR(1,"表单验证失败"),
//    EMAIL_ERROR(2,"发送邮件失败"),
//    EMAIL_ERROR1(3,"没发送邮箱验证码"),
//    EMAIL_ERROR2(4,"没进行找回密码第一步操作"),
//    EMAIL_ERROR3(5,"没进行身份验证操作"),
//    EMAIL_ERRO4(6,"重置密码失败")
    ;
    private Integer code;
    private String message;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    ResultEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
