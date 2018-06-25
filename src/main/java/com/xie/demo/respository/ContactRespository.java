package com.xie.demo.respository;

import com.xie.demo.domain.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * MR.XIE
 * 2018/5/5 16:15
 **/
public interface ContactRespository extends JpaRepository<Contact,Integer> {

}
