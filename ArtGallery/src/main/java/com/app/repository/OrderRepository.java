package com.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.model.Order;
import com.app.model.User;
import com.app.model.enums.OrderStatus;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByBuyerId(Long userId);
    List<Order> findByArtist(Artist artist);
    List<Order> findByArtistId(Long artistId);
    Page<Order> findByBuyerId(Long buyerId, Pageable pageable);
    Page<Order> findByArtist(Artist artist, Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status")
    List<Order> findByStatus(@Param("status") OrderStatus status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.artist.id = :artistId AND o.status = 'DELIVERED'")
    Long countCompletedSalesByArtist(@Param("artistId") Long artistId);
}