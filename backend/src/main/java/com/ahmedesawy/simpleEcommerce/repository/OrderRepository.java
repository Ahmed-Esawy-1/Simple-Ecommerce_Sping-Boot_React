package com.ahmedesawy.simpleEcommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ahmedesawy.simpleEcommerce.model.Order;

import java.util.List;


public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByOrderByOrderDateDesc();
}
