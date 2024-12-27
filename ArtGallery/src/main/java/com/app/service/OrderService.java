package com.app.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

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

    public Order createOrder(Long userId, Long artworkId, String shippingAddress) {
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

        // Use existing artwork service method
        artworkService.markAsReserved(artworkId);

        return orderRepository.save(order);
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
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!isValidStatusTransition(order.getStatus(), newStatus)) {
            throw new IllegalStateException("Invalid status transition");
        }

        order.setStatus(newStatus);
        
        // Use existing artwork service methods
        switch (newStatus) {
            case PAID -> artworkService.markAsSold(order.getArtwork().getId());
            case CANCELLED -> {
                Artwork artwork = order.getArtwork();
                artworkService.updateArtworkStatus(artwork.getId(), ArtworkStatus.AVAILABLE);
            }
            default -> {}
        }

        return orderRepository.save(order);
    }
    

    public List<Order> getOrdersByArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        return orderRepository.findByArtist(artist);
    }
    
    public Page<Order> getAllOrders(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByStatus(status, pageable);
        }
        return orderRepository.findAll(pageable);
    }

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
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, String userEmail) {
        Order order = getOrderWithAccessCheck(orderId, userEmail);
        
        if (!isValidStatusTransition(order.getStatus(), newStatus)) {
            throw new IllegalStateException("Invalid status transition");
        }

        order.setStatus(newStatus);
        updateArtworkStatus(order.getArtwork(), newStatus);
        
        return orderRepository.save(order);
    }
    
    private void updateArtworkStatus(Artwork artwork, OrderStatus orderStatus) {
        switch (orderStatus) {
            case PAID -> artworkService.markAsSold(artwork.getId());
            case CANCELLED -> artworkService.updateArtworkStatus(artwork.getId(), ArtworkStatus.AVAILABLE);
            case CONFIRMED -> artworkService.markAsReserved(artwork.getId());
            default -> { }
        }
    }

    public Page<Order> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByBuyerId(userId, pageable);
    }

    public Page<Order> getArtistSales(Long userId, Pageable pageable) {
        Artist artist = artistRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        return orderRepository.findByArtist(artist, pageable);
    }
}