package com.xie.demo.aspect;

import com.xie.demo.enums.ResultEnum;
import com.xie.demo.exception.ForgSaleException;
import com.xie.demo.service.MangerService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * MR.XIE
 * 2018/5/13 14:20
 *打印日志，并判断收是否有访问权限
 **/
@Aspect
@Component
public class MangerAspect {
    private final static Logger logger=LoggerFactory.getLogger(MangerAspect.class);
    @Autowired
    private MangerService mangerService;
    @Pointcut("execution(public * com.xie.demo.controller.MangerController.*(..))")
    public void log(){
    }
    @Before("log()")
    public void doBefore(JoinPoint joinPoint){
        ServletRequestAttributes attributes=(ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
        HttpServletRequest request=attributes.getRequest();
        //url
        logger.info("url={}",request.getRequestURL());
        //method
        logger.info("method:{}",request.getMethod());
        //ip
        logger.info("ip:{}",request.getRemoteAddr());
        //类方法 加入参数JoinPoint
        logger.info("class_method:{}",joinPoint.getSignature().getDeclaringTypeName()+"."+joinPoint.getSignature().getName());
        //参数
        logger.info("args={}",joinPoint.getArgs());

    }

    @After("log()")
    public void doAfter(){
        logger.info("success");
    }
    //下面是打印请求返回的内容
    @AfterReturning(returning ="object",pointcut = "log()")
    public void doAfterReturing(Object object){
        if(object!=null)
            logger.info("response:{}",object.toString());
    }



    /**
     * 后置异常通知
     *  定义一个名字，该名字用于匹配通知实现方法的一个参数名，当目标方法抛出异常返回后，将把目标方法抛出的异常传给通知方法；
     *  throwing:限定了只有目标方法抛出的异常与通知方法相应参数异常类型时才能执行后置异常通知，否则不执行，
     *            对于throwing对应的通知方法参数为Throwable类型将匹配任何异常。
     * @param joinPoint
     * @param exception
     */

    @AfterThrowing(value = "log()",throwing = "exception")
    public void doAfterThrowingAdvice(JoinPoint joinPoint, Throwable exception) throws Exception{
        //目标方法名：
        logger.info(joinPoint.getSignature().getName());
        if(exception instanceof ForgSaleException){
            {
                logger.info(((ForgSaleException)exception).getMessage());
            }
        } else
        {
            logger.info(exception.getMessage());
        }
    }



    //判断管理员是否登录了,或者是否登录过了但是密码信息改了再判断账号密码是否正确
    public boolean MangerIsLogin()
    {
        ServletRequestAttributes attributes=(ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
        HttpServletRequest request=attributes.getRequest();
        String username,password;
        if((request.getSession().getAttribute("Manger_username"))!=null){
            username=(String)request.getSession().getAttribute("Manger_username");
        }
        else{
            return false;
        }
        if(request.getSession().getAttribute("Manger_password")!=null)
        {
            password=(String)request.getSession().getAttribute("Manger_password");
        }
        else
        {
            return false;
        }

        boolean result=mangerService.confirm_UsernameAndPassword(username,password);
        if(result==false)//账号信息已改变
        {    request.getSession().removeAttribute("Manger_username");
            request.getSession().removeAttribute("Manger_password");
            return false;
        }
        else {

            return true;
        }
    }
    /**
     * 环绕通知：
     * 环绕通知非常强大，可以决定目标方法是否执行，什么时候执行，执行时是否需要替换方法参数，执行完毕是否需要替换返回值。
     * 环绕通知第一个参数必须是org.aspectj.lang.ProceedingJoinPoint类型
     */
    @Around("log()")
    public Object  doAroundAdvice(ProceedingJoinPoint proceedingJoinPoint)throws Throwable
    {
        System.out.println("环绕通知的目标方法名："+proceedingJoinPoint.getSignature().getName());
        //proceedingJoinPoint.getArgs();//获取参数返回类型为Object[] args;
        if(MangerIsLogin()==true) {
            return proceedingJoinPoint.proceed();//调用执行目标方法  返回参数
        }
        else{
            throw new ForgSaleException(ResultEnum.MangerBackgound_Visit_ERROR);
        }
    }

}
