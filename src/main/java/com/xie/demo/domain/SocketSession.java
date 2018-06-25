package com.xie.demo.domain;

import java.util.HashMap;
import java.util.Map;

/**
 * 注册和删除客服和访客的Id
 * MR.XIE
 * 2018/4/22 10:06
 **/
public class SocketSession {
    public static String customer_usernmame=null;
    public static String customer_password=null;
    private final Map<String,String> userSessionIds=new HashMap<>();
    public SocketSession() {
    }
    public Map<String, String> getUserSessionIds() {
        return userSessionIds;
    }
    public String get_service_first(){
        String id=null;
        for (String userid:this.userSessionIds.keySet())
        {
            if(this.userSessionIds.get(userid).equals("1")) {
                id = userid;
                break;
            }

        }
        return  id;
    }
    public void reigster_session(String userid,String type){
        if(userid.equals("")||type.equals(""))
            return;
        if(type.equals("1"))
        { for (String id:this.userSessionIds.keySet())
        {
            if(this.userSessionIds.get(id).equals("1")) {
               this.unregister_session(id);
                break;
            }

        }

        }

        this.userSessionIds.put(userid,type);
    }
    public void unregister_session(String userid){
         if(this.userSessionIds.containsKey(userid)==true)
             this.userSessionIds.remove(userid);
    }
}
