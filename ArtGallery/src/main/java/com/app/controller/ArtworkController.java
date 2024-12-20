package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                                               @RequestBody Artwork artworkDetails) {
        Artwork updatedArtwork = artworkService.updateArtwork(id, artworkDetails);
        return new ResponseEntity<>(updatedArtwork, HttpStatus.OK);
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
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteArtwork(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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