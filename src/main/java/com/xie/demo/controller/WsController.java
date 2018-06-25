package com.xie.demo.controller;

import com.xie.demo.domain.Customer;
import com.xie.demo.domain.SocketSession;
import com.xie.demo.service.CustomerServiceService;
import com.xie.demo.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;

/**
 * MR.XIE
 * 2018/4/21 19:06
 **/
@Controller
public class WsController {
    @Autowired
    private CustomerServiceService customerServiceService;

    @Resource
    WebSocketService webSocketService;
    SocketSession socketSession = new SocketSession();
    private Object object = "key";

    @MessageMapping("/welcome")
    @SendTo("/topic/getResponse")
    public Customer say(Customer message) throws Exception {
        if (message.getType().equals("0") || message.getType().equals("1")) {//0表示访客注册，1表示客服注册(注释:只有一个客服）
            if (message.getType().equals("1")) {
                if(CustomerIsLogin()==false){//客服没访问权限
                    String service = socketSession.get_service_first();
                    if (service != null) {
                        socketSession.unregister_session(service);
                    }
                    message.setType("2");
                    message.setContent("客服");
                }

            }
            socketSession.reigster_session(message.getId(), message.getType());//注册session
        } else if (message.getType().equals("2"))//2表示注销
        {
            if (message.getContent().equals("客服")) {//客服注销
                SocketSession.customer_usernmame = null;
                SocketSession.customer_password = null;
            }
            socketSession.unregister_session(message.getId());

        } else {
            if (message.getType().equals("访客"))//访客发送数据
            {
                if (CustomerIsLogin()) {
                    String service = socketSession.get_service_first();
                    if (service != null) {
                        message.setReceive_id(service);
                        webSocketService.send2Users(service, message);
                    }else{//客服不存在了
                        SocketSession.customer_usernmame = null;
                        SocketSession.customer_password = null;
                        message.setType("2");
                        message.setContent("客服");
                    }
                } else {//客服没权限了
                    String service = socketSession.get_service_first();
                    if (service != null) {
                        socketSession.unregister_session(service);
                    }
                    SocketSession.customer_usernmame = null;
                    SocketSession.customer_password = null;
                    message.setType("2");
                    message.setContent("客服");
                }

            } else {
                if (CustomerIsLogin()) {
                    webSocketService.send2Users(message.getReceive_id(), message);//客服发送数据
                } else {//客服没访问权限了
                    socketSession.unregister_session(message.getId());
                    message.setType("2");
                    message.setContent("客服");
                }
            }
        }
        return message;
    }

    //判断客服是否登录了,或者是否登录过了但是密码信息改了再判断账号密码是否正确
    public boolean CustomerIsLogin() {
        String username = SocketSession.customer_usernmame;
        String password = SocketSession.customer_password;
        if (username == null || password == null)
            return false;
        boolean result = customerServiceService.findFirstByUsernameAndPassword(username, password);
        if (result == false)//账号信息已改变
        {
            SocketSession.customer_usernmame = null;
            SocketSession.customer_password = null;
            return false;
        } else {

            return true;
        }
    }


}
