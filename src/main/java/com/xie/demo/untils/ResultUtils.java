package com.xie.demo.untils;


import com.xie.demo.domain.Result;
//异常处理集合
public class ResultUtils {
    public static  Result success(Object object){
        Result result=new Result();
        result.setCode(0);
        result.setMessage("成功");
        result.setData(object);
        return result;
    }
    public static Result success(){
        return success(null);
    }
    public static Result error(int code,String message){
        Result result=new Result();
        result.setCode(code);
        result.setMessage(message);
        result.setData(null);
        return result;
    }
}
