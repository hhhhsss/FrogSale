package com.xie.demo.service;

import com.xie.demo.untils.ResultUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

/**
 * MR.XIE
 * 2018/4/8 10:52
 **/
@Service
public class SendEmailCode {
    private final Logger logger=LoggerFactory.getLogger(SendEmailCode.class);
    @Autowired
    private JavaMailSender mailSender;//qq邮箱发送类
    @Value("${spring.mail.username}")//获取配置的邮箱账号
    private String form;
    public  Boolean sendEmail(String to,String subject,String content){
        try{
            final MimeMessage mimeMessage=this.mailSender.createMimeMessage();
            final MimeMessageHelper message=new MimeMessageHelper(mimeMessage);
            message.setFrom(this.form);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            this.mailSender.send(mimeMessage);
            System.out.println(form);
            return true;
        }catch (Exception e){
           logger.info(ResultUtils.error(2,e.getMessage()).toString());
            return false;
        }
    }

}
