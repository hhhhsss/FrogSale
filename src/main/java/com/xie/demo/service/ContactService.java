package com.xie.demo.service;

import com.xie.demo.domain.Contact;
import com.xie.demo.respository.ContactRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * MR.XIE
 * 2018/5/5 16:18
 **/
@Service
public class ContactService {
    @Autowired
    private ContactRespository contactRespository;
    //获取联系信息
    public Contact getContact(){
        List<Contact> contacts=contactRespository.findAll(new Sort(Sort.Direction.DESC,"id"));
        if(contacts.size()==0)
            return null;
        else
            return contacts.get(0);
    }
    //保存联系信息
    @Transactional
    public boolean saveContact(Contact contact){
        contactRespository.deleteAll();
        Contact contact1=contactRespository.save(contact);
        if(contact1!=null)
            return true;
        else
            return false;
    }
}
