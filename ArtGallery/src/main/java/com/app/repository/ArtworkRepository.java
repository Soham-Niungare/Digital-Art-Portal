package com.app.repository;

import java.awt.print.Pageable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.model.enums.ArtworkStatus;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByArtist(Artist artist);
    List<Artwork> findByStatus(ArtworkStatus status);
    List<Artwork> findByArtistAndStatus(Artist artist, ArtworkStatus status);
    
    @Query("SELECT a FROM Artwork a WHERE a.price BETWEEN :minPrice AND :maxPrice")
    List<Artwork> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT a FROM Artwork a WHERE a.status = :status ORDER BY a.createdAt DESC")
    List<Artwork> findLatestByStatus(@Param("status") ArtworkStatus status, Pageable pageable);
}