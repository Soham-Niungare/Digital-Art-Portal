package com.app.model.enums;

public enum OrderStatus {
    PENDING,        // Initial state when order is created
    CONFIRMED,      // Order confirmed by admin
    PAID,          // Payment received
    SHIPPED,       // Artwork has been shipped
    DELIVERED,     // Artwork has been delivered
    CANCELLED      // Order has been cancelled
}