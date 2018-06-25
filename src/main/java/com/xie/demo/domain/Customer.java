package com.xie.demo.domain;

import java.io.*;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Date;
import java.util.Enumeration;

/**
 * 发送的udp数据格式
 * MR.XIE
 * 2018/4/18 11:09
 **/
public class Customer implements Serializable {
    private String receive_id;
    private String id;
    private String date;
    private String type;
    private String content;

    public String getReceive_id() {
        return receive_id;
    }

    public void setReceive_id(String receive_id) {
        this.receive_id = receive_id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    public Customer(String receive_id, String id, String date, String type, String content) {
        this.receive_id = receive_id;
        this.id = id;
        this.date = date;
        this.type = type;
        this.content = content;
    }

    public Customer() {
    }
    public static Object b2o(byte[] buffer)
    {
       Object object=null;
        try{
            ByteArrayInputStream buffers=new ByteArrayInputStream(buffer);
            ObjectInputStream in=new ObjectInputStream(buffers);
            object=in.readObject();
            in.close();
        }catch (Exception e){
            System.out.println("序列化对象失败"+",原因:"+e);
        }
        return object;
    }
    public static byte[] o2b(Customer customer){
        ByteArrayOutputStream buffers=new ByteArrayOutputStream();
        try{
            ObjectOutputStream out=new ObjectOutputStream(buffers);
            out.writeObject(customer);
            out.close();
        }catch (Exception e){
            System.out.println("序列化对象失败"+",原因:"+e);
            return  null;
        }
        return buffers.toByteArray();
    }
    public static String getIpAdress() throws IOException {
        Enumeration<NetworkInterface> interfaces = null;
        String hostAddress=null;
        interfaces = NetworkInterface.getNetworkInterfaces();
        while (interfaces.hasMoreElements()) {
            NetworkInterface ni = interfaces.nextElement();
            Enumeration<InetAddress> addresss = ni.getInetAddresses();
            while (addresss.hasMoreElements()) {
                InetAddress nextElement = addresss.nextElement();
                hostAddress = nextElement.getHostAddress();
            }
        }
        return hostAddress;
    }
    public static String getCurrentTime(){
        Date date=new Date();
        int year=date.getYear()+1900;
        int month=date.getMonth()+1;
        int day=date.getDate();
        int hour=date.getHours();
        int minute=date.getMinutes();
        int second=date.getSeconds();
        String current_date=year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
        return current_date;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "receive_id='" + receive_id + '\'' +
                ", id='" + id + '\'' +
                ", date='" + date + '\'' +
                ", type='" + type + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
