package com.app.controller;

import org.springframework.web.bind.annotation.*;

import com.app.dto.CreateOrderRequest;
import com.app.dto.UpdateOrderStatusRequest;
import com.app.model.Order;
import com.app.model.User;
import com.app.model.enums.OrderStatus;
import com.app.service.OrderService;
import com.app.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Order order = orderService.createOrder(user.getId(), request.getArtworkId(), request.getShippingAddress());
        return ResponseEntity.ok(order);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(status, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('CUSTOMER', 'ARTIST', 'ADMIN')")
    public ResponseEntity<Order> getOrder(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.getOrderWithAccessCheck(id, userDetails.getUsername());
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ARTIST')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.updateOrderStatus(id, request.getStatus(), userDetails.getUsername());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<Page<Order>> getUserOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Page<Order> orders = orderService.getUserOrders(user.getId(), pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/my-sales")
    @PreAuthorize("hasAuthority('ARTIST')")
    public ResponseEntity<Page<Order>> getArtistSales(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Page<Order> sales = orderService.getArtistSales(user.getId(), pageable);
        return ResponseEntity.ok(sales);
    }
}
