package com.xie.demo.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

/**
 * 配置WebSocket
 * MR.XIE
 * 2018/4/21 18:42
 **/
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {
    //webSocket相关配置
    //链接地址
//    public static String WEBSOCKETPATHPERFIX = "/ws-push";
//    public static String WEBSOCKETPATH = "/endpointWisely";
//    //消息代理路径
//    public static String WEBSOCKETBROADCASTPATH = "/topic";
//    //前端发送给服务端请求地址
//    public static final String FORETOSERVERPATH = "/welcome";
//    //服务端生产地址,客户端订阅此地址以接收服务端生产的消息
//    public static final String PRODUCERPATH = "/topic/getResponse";
//    //点对点消息推送地址前缀
//    public static final String P2PPUSHBASEPATH = "/user";
//    //点对点消息推送地址后缀,最后的地址为/user/用户识别码/msg
//    public static final String P2PPUSHPATH = "/msg";
   @Override
    public void registerStompEndpoints(StompEndpointRegistry stompEndpointRegistry) {
       //注册一个Stomp的节点（endpoint）,并指定使用SockJS协议。
       stompEndpointRegistry.addEndpoint("/endpointWisely").setAllowedOrigins("*").withSockJS();
   }
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //服务端发送消息给客户端的域,多个用逗号隔开
        registry.enableSimpleBroker("/topic","/user");
        //定义一对一推送的时候前缀
        registry.setUserDestinationPrefix("/user/");
        //定义websoket前缀
        registry.setApplicationDestinationPrefixes("/ws-push");
    }
}
