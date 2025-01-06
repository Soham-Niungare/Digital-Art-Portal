package com.app.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.app.dto.OrderDTO;
import com.app.exception.ForbiddenException;
import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.model.Order;
import com.app.model.User;
import com.app.model.enums.ArtworkStatus;
import com.app.model.enums.OrderStatus;
import com.app.model.enums.Role;
import com.app.repository.ArtistRepository;
import com.app.repository.OrderRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ArtworkService artworkService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ArtistRepository artistRepository;

    public OrderDTO createOrder(Long userId, Long artworkId, String shippingAddress) {
        Artwork artwork = artworkService.getArtworkById(artworkId);
        
        if (artwork.getStatus() != ArtworkStatus.AVAILABLE) {
            throw new IllegalStateException("Artwork is not available for purchase");
        }

        User buyer = userService.getUserById(userId);

        Order order = new Order();
        order.setArtwork(artwork);
        order.setBuyer(buyer);
        order.setArtist(artwork.getArtist());
        order.setTotalAmount(artwork.getPrice());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(shippingAddress);

        artworkService.markAsReserved(artworkId);
        Order savedOrder = orderRepository.save(order);
        
        return convertToDTO(savedOrder);
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setBuyerId(order.getBuyer().getId());
        String buyerFullName = order.getBuyer().getFirstName() + " " + order.getBuyer().getLastName();
        dto.setBuyerName(buyerFullName);
        dto.setArtistName(order.getArtist().getArtistName());
        dto.setArtworkId(order.getArtwork().getId());
        dto.setArtworkTitle(order.getArtwork().getTitle());
        dto.setArtworkImageUrl(order.getArtwork().getImageUrl());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderDate(order.getCreatedAt());    // using createdAt since there's no direct orderDate getter
        dto.setLastUpdated(order.getUpdatedAt());
        dto.setShippingAddress(order.getShippingAddress());
        return dto;
    }
    
    public List<String> getAllAddressesForUser(Long userId) {
        List<Order> orders = orderRepository.findByBuyerId(userId);
        return orders.stream()
                     .map(Order::getShippingAddress)  // Extracting address from each order
                     .collect(Collectors.toList());
    }
    
    
    private boolean isValidStatusTransition(OrderStatus current, OrderStatus next) {
        Map<OrderStatus, Set<OrderStatus>> validTransitions = new HashMap<>();
        validTransitions.put(OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED));
        validTransitions.put(OrderStatus.CONFIRMED, Set.of(OrderStatus.PAID, OrderStatus.CANCELLED));
        validTransitions.put(OrderStatus.PAID, Set.of(OrderStatus.SHIPPED));
        validTransitions.put(OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED));
        validTransitions.put(OrderStatus.DELIVERED, Collections.emptySet());
        validTransitions.put(OrderStatus.CANCELLED, Collections.emptySet());

        Set<OrderStatus> allowedTransitions = validTransitions.getOrDefault(current, Collections.emptySet());
        return allowedTransitions.contains(next);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus newStatus, String userEmail) {
        Order order = getOrderWithAccessCheck(orderId, userEmail);
        
        if (!isValidStatusTransition(order.getStatus(), newStatus)) {
            throw new IllegalStateException("Invalid status transition");
        }

        order.setStatus(newStatus);
        updateArtworkStatus(order.getArtwork(), newStatus);
        
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }
    

    public Page<OrderDTO> getAllOrders(OrderStatus status, Pageable pageable) {
        Page<Order> orders = (status != null) 
            ? orderRepository.findByStatus(status, pageable)
            : orderRepository.findAll(pageable);
            
        return orders.map(this::convertToDTO);
    }
    
//    public Page<Order> getAllOrders(OrderStatus status, Pageable pageable) {
//        if (status != null) {
//            return orderRepository.findByStatus(status, pageable);
//        }
//        return orderRepository.findAll(pageable);
//    }

    public Order getOrderWithAccessCheck(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userService.getUserByEmail(userEmail);
        
        if (user.getRole() == Role.ADMIN) {
            return order;
        }

        if (order.getBuyer().getId().equals(user.getId()) ||
            (order.getArtist() != null && 
             order.getArtist().getUser() != null && 
             order.getArtist().getUser().getId().equals(user.getId()))) {
            return order;
        }

        throw new ForbiddenException("You don't have permission to view this order");
    }
//    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, String userEmail) {
//        Order order = getOrderWithAccessCheck(orderId, userEmail);
//        
//        if (!isValidStatusTransition(order.getStatus(), newStatus)) {
//            throw new IllegalStateException("Invalid status transition");
//        }
//
//        order.setStatus(newStatus);
//        updateArtworkStatus(order.getArtwork(), newStatus);
//        
//        return orderRepository.save(order);
//    }
    
    private void updateArtworkStatus(Artwork artwork, OrderStatus orderStatus) {
        switch (orderStatus) {
            case PAID -> artworkService.markAsSold(artwork.getId());
            case CANCELLED -> artworkService.updateArtworkStatus(artwork.getId(), ArtworkStatus.AVAILABLE);
            case CONFIRMED -> artworkService.markAsReserved(artwork.getId());
            default -> { }
        }
    }

    public Page<OrderDTO> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByBuyerId(userId, pageable)
                            .map(this::convertToDTO);
    }

    public Page<OrderDTO> getArtistSales(Long userId, Pageable pageable) {
        User user = userService.getUserById(userId);
        Artist artist = artistRepository.findByUser(user)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        return orderRepository.findByArtist(artist, pageable)
                            .map(this::convertToDTO);
    }
}