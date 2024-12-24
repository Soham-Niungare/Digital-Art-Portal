package com.app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.app.model.Artwork;
import com.app.model.enums.ArtworkStatus;
import com.app.service.ArtworkService;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "http://localhost:3000")  // For React frontend
public class ArtworkController {
    private final ArtworkService artworkService;

    @Autowired
    public ArtworkController(ArtworkService artworkService) {
        this.artworkService = artworkService;
    }

    // Create artwork
    @PostMapping
    public ResponseEntity<Artwork> createArtwork(@RequestBody Artwork artwork, 
                                               @RequestParam Long artistId) {
        Artwork newArtwork = artworkService.createArtwork(artwork, artistId);
        return new ResponseEntity<>(newArtwork, HttpStatus.CREATED);
    }

    // Get all artworks
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        List<Artwork> artworks = artworkService.getAllArtworks();
        return new ResponseEntity<>(artworks, HttpStatus.OK);
    }

    // Get artwork by ID
    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        Artwork artwork = artworkService.getArtworkById(id);
        return new ResponseEntity<>(artwork, HttpStatus.OK);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Artwork>> searchArtworks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String medium,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(artworkService.searchArtworks(title, medium, minPrice, maxPrice));
    }

    // Get artworks by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Artwork>> getArtworksByStatus(
            @PathVariable ArtworkStatus status) {
        List<Artwork> artworks = artworkService.getArtworksByStatus(status);
        return new ResponseEntity<>(artworks, HttpStatus.OK);
    }

    // Get artworks by artist
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Artwork>> getArtworksByArtist(
            @PathVariable Long artistId) {
        List<Artwork> artworks = artworkService.getArtworksByArtist(artistId);
        return new ResponseEntity<>(artworks, HttpStatus.OK);
    }

    // Update artwork
    @PutMapping("/{id}")
    public ResponseEntity<Artwork> updateArtwork(@PathVariable Long id, 
            @RequestBody Artwork artwork,
            Authentication authentication) {
    	UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    	return ResponseEntity.ok(artworkService.updateArtwork(id, artwork, userDetails.getUsername()));
    }

    // Update artwork status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Artwork> updateArtworkStatus(
            @PathVariable Long id, 
            @RequestParam ArtworkStatus status) {
        Artwork updatedArtwork = artworkService.updateArtworkStatus(id, status);
        return new ResponseEntity<>(updatedArtwork, HttpStatus.OK);
    }

    // Delete artwork
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArtwork(@PathVariable Long id,
            Authentication authentication) {
    	UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    	artworkService.deleteArtwork(id, userDetails.getUsername());
    	return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}/image")
    public ResponseEntity<Map<String, String>> getArtworkImage(@PathVariable Long id) {
        Artwork artwork = artworkService.getArtworkById(id);
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", artwork.getImageUrl());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadImage(@PathVariable Long id,
                                            @RequestParam("file") MultipartFile file,
                                            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String imageUrl = artworkService.uploadImage(id, file, userDetails.getUsername());
        return ResponseEntity.ok(imageUrl);
    }
    // Status-specific endpoints
    @GetMapping("/available")
    public ResponseEntity<List<Artwork>> getAvailableArtworks() {
        List<Artwork> artworks = artworkService.getAvailableArtworks();
        return new ResponseEntity<>(artworks, HttpStatus.OK);
    }

    @GetMapping("/exhibition")
    public ResponseEntity<List<Artwork>> getExhibitionArtworks() {
        List<Artwork> artworks = artworkService.getExhibitionArtworks();
        return new ResponseEntity<>(artworks, HttpStatus.OK);
    }

    @PatchMapping("/{id}/mark-sold")
    public ResponseEntity<Artwork> markAsSold(@PathVariable Long id) {
        Artwork artwork = artworkService.markAsSold(id);
        return new ResponseEntity<>(artwork, HttpStatus.OK);
    }

    @PatchMapping("/{id}/mark-reserved")
    public ResponseEntity<Artwork> markAsReserved(@PathVariable Long id) {
        Artwork artwork = artworkService.markAsReserved(id);
        return new ResponseEntity<>(artwork, HttpStatus.OK);
    }

    @PatchMapping("/{id}/submit-review")
    public ResponseEntity<Artwork> submitForReview(@PathVariable Long id) {
        Artwork artwork = artworkService.submitForReview(id);
        return new ResponseEntity<>(artwork, HttpStatus.OK);
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Artwork> archiveArtwork(@PathVariable Long id) {
        Artwork artwork = artworkService.archiveArtwork(id);
        return new ResponseEntity<>(artwork, HttpStatus.OK);
    }
}