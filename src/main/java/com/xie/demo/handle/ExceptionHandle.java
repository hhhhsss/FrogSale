package com.xie.demo.handle;

import com.xie.demo.exception.ForgSaleException;
import com.xie.demo.untils.ResultUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 *统一异常处理
 */

@ControllerAdvice
public class ExceptionHandle {
    private final Logger logger=LoggerFactory.getLogger(Exception.class);
//    @ExceptionHandler(value=Exception.class)//捕获哪种异常
//    @ResponseBody
//    public Result handle(Exception e){
//        if(e instanceof ForgSaleException)
//
//        {   if(((ForgSaleException) e).getCode()==-2)//管理员没访问权限
//            return ResultUtils.error(((ForgSaleException) e).getCode(), ((ForgSaleException) e).getMessage());
//        }
//        else {
//            logger.info("[系统错误]:{}",e);
//            return ResultUtils.error(-1,"未知");
//        }
//    }

    @ExceptionHandler(value=ForgSaleException.class)//捕捉访问异常
    public ModelAndView MangerVisitHandle(HttpServletResponse response, ForgSaleException e) throws Exception{
        if(((ForgSaleException) e).getCode()==-2)//管理员没访问权限
        {
            PrintWriter writer=response.getWriter();
            writer.write(new JSONObject(ResultUtils.error(((ForgSaleException) e).getCode(), ((ForgSaleException) e).getMessage())).toString());
            writer.flush();;
            writer.close();
            return null;
        }
        else if(((ForgSaleException) e).getCode()==-3){//没有客服访问权限
            ModelAndView modelAndView=new ModelAndView();
            modelAndView.setViewName("/CustomerServiceLogin.html");
            return modelAndView;
        }
        else
            return null;

    }

}
