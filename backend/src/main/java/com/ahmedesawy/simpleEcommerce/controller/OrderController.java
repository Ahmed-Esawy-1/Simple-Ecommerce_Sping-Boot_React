package com.ahmedesawy.simpleEcommerce.controller;

import com.ahmedesawy.simpleEcommerce.service.OrderService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.simpleEcommerce.model.dto.OrderRequest;
import com.ahmedesawy.simpleEcommerce.model.dto.OrderResponse;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api")
@CrossOrigin
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ---- QUIRES ----------------------------------------------------------
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getOrders() {
        List<OrderResponse> responses = orderService.getAllOrderResponses();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    // ---- CREATE -----------------------------------------------------
    @PostMapping("/orders/place")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse = orderService.placeOrder(orderRequest);
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }


}
