package com.ahmedesawy.simpleEcommerce.service;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;


import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.simpleEcommerce.model.Order;
import com.ahmedesawy.simpleEcommerce.model.OrderItem;
import com.ahmedesawy.simpleEcommerce.model.Product;
import com.ahmedesawy.simpleEcommerce.model.dto.OrderItemRequest;
import com.ahmedesawy.simpleEcommerce.model.dto.OrderItemResponse;
import com.ahmedesawy.simpleEcommerce.model.dto.OrderRequest;
import com.ahmedesawy.simpleEcommerce.model.dto.OrderResponse;
import com.ahmedesawy.simpleEcommerce.repository.OrderRepository;
import com.ahmedesawy.simpleEcommerce.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final VectorStore vectorStore;

    @Transactional
    public List<OrderResponse> getAllOrderResponses() {
        List<Order> orders = orderRepository.findByOrderByOrderDateDesc();
        List<OrderResponse> orderResponses = new ArrayList<>();

        for(Order order: orders) {
            List<OrderItemResponse> itemResponses = new ArrayList<>();
            for(OrderItem item: order.getItems()) {
                OrderItemResponse itemResponse = new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
                );
                itemResponses.add(itemResponse);
            }

            OrderResponse response = new OrderResponse(
                order.getOrderId(),
                order.getCustomerName(),
                order.getEmail(),
                order.getStatus(),
                order.getOrderDate(),
                itemResponses
            );
            orderResponses.add(response);
        }

        return orderResponses;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {

        Order order = new Order();
        order.setOrderId("ORD" + UUID.randomUUID().toString().substring(0, 8));
        order.setCustomerName(request.customerName());
        order.setEmail(request.email());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());

        List<OrderItem> orderItems = new ArrayList<>();

        for(OrderItemRequest itemRequest: request.items()) {

            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setStockQuantity(product.getStockQuantity() - itemRequest.quantity());
            productRepository.save(product);


            String filter = String.format("productId == '%s'", String.valueOf(product.getId()));
            vectorStore.delete(filter);

            String updatedContent = String.format("""
                Product Name: %s
                Description: %s
                Brand: %s
                Category: %s
                Price: %.2f
                Release Date: %s
                Available: %s
                Stock: %s
                """,
                    product.getName(),
                    product.getDescription(),
                    product.getBrand(),
                    product.getCategory(),
                    product.getPrice(),
                    product.getReleaseDate(),
                    product.isProductAvailable(),
                    product.getStockQuantity()
            );

            Document UpdatedDoc = new Document(
                    UUID.randomUUID().toString(),
                    updatedContent,
                    Map.of("productId", String.valueOf(product.getId()))
            );

            vectorStore.add(List.of(UpdatedDoc));

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.quantity())
                    .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())))
                    .order(order)
                    .build();
            orderItems.add(orderItem);

        }

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        StringBuilder content = new StringBuilder();
        content.append("Order Summary: \n");
        content.append("Order  ID: ").append(savedOrder.getOrderId()).append("\n");
        content.append("Customer: ").append(savedOrder.getCustomerName()).append("\n");
        content.append("Email: ").append(savedOrder.getEmail()).append("\n");
        content.append("Date: ").append(savedOrder.getOrderDate()).append("\n");
        content.append("Status: ").append(savedOrder.getStatus()).append("\n");
        content.append("Products: \n");

        for(OrderItem orderItem : savedOrder.getItems()) {
            content.append("- ").append(orderItem.getProduct().getName())
                    .append(" x ").append(orderItem.getQuantity())
                    .append(" = ").append(orderItem.getTotalPrice()).append("\n");
        }

        Document document = new Document(
                UUID.randomUUID().toString(),
                content.toString(),
                Map.of("orderId", savedOrder.getOrderId())
        );

        vectorStore.add(List.of(document));

        List<OrderItemResponse> itemResponses = new ArrayList<>();

        for(OrderItem item: order.getItems()) {
            OrderItemResponse orderItemResponse = new OrderItemResponse(
                item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
            );
            itemResponses.add(orderItemResponse);
        }

        return new OrderResponse(
            savedOrder.getOrderId(),
            savedOrder.getCustomerName(),
            savedOrder.getEmail(),
            savedOrder.getStatus(),
            savedOrder.getOrderDate(),
            itemResponses
        );
    }


}


