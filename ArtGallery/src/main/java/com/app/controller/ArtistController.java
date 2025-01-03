package com.app.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.service.ArtistService;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "Authorization")
public class ArtistController {
    @Autowired
    private ArtistService artistService;

    // Get all artists
    @GetMapping
    public ResponseEntity<List<Artist>> getAllArtists() {
        return ResponseEntity.ok(artistService.getAllArtists());
    }

    // Get artist by ID
    @GetMapping("/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.getArtistById(id));
    }

    // Update artist profile
    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Artist artistDetails) {
        return ResponseEntity.ok(artistService.updateArtist(id, artistDetails));
    }

    // Get artworks by artist ID
    @GetMapping("/{id}/artworks")
    public ResponseEntity<List<Artwork>> getArtworksByArtist(@PathVariable Long id) {
        return ResponseEntity.ok(artistService.getArtworksByArtist(id));
    }
}