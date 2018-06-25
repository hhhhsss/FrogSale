package com.xie.demo.service;

import com.xie.demo.domain.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * MR.XIE
 * 2018/4/21 19:01
 **/
@Service
public class WebSocketService {
    @Autowired
    private SimpMessagingTemplate template;
    /**
     * 广播
     * 发给所有在线用户
     *
     * @param msg
     */
    public void sendMsg(Customer msg) {
        template.convertAndSend("/topic/getResponse", msg);
    }
    /**
     * 发送给指定用户
     * @param users
     * @param msg
     */
    public void send2Users(String users,Customer msg) {

            template.convertAndSendToUser(users, "/msg", msg);

    }
}
