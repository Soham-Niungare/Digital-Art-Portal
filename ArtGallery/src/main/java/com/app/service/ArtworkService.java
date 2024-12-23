package com.app.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.model.enums.ArtworkStatus;
import com.app.repository.ArtistRepository;
import com.app.repository.ArtworkRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ArtworkService {
    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;

    public ArtworkService(ArtworkRepository artworkRepository, ArtistRepository artistRepository) {
        this.artworkRepository = artworkRepository;
        this.artistRepository = artistRepository;
    }

    // Create Methods
    public Artwork createArtwork(Artwork artwork, Long artistId) {
        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        artwork.setArtist(artist);
        artwork.setStatus(ArtworkStatus.AVAILABLE);
        return artworkRepository.save(artwork);
    }

    // Read Methods
    public List<Artwork> getAllArtworks() {
        return artworkRepository.findAll();
    }

    public Artwork getArtworkById(Long id) {
        return artworkRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Artwork not found"));
    }

    public List<Artwork> getArtworksByStatus(ArtworkStatus status) {
        return artworkRepository.findByStatus(status);
    }

    public List<Artwork> getArtworksByArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        return artworkRepository.findByArtist(artist);
    }
    
    public List<Artwork> searchArtworks(String title, String medium, Double minPrice, Double maxPrice) {
        List<Artwork> artworks = getAllArtworks();
        
        return artworks.stream()
            .filter(artwork -> {
                boolean matches = true;
                
                if (title != null && !title.isEmpty()) {
                    matches &= artwork.getTitle().toLowerCase().contains(title.toLowerCase());
                }
                
                if (medium != null && !medium.isEmpty()) {
                    matches &= artwork.getMedium().toLowerCase().contains(medium.toLowerCase());
                }
                
                if (minPrice != null) {
                    matches &= artwork.getPrice() >= minPrice;
                }
                
                if (maxPrice != null) {
                    matches &= artwork.getPrice() <= maxPrice;
                }
                
                return matches;
            })
            .collect(Collectors.toList());
    }

    // Update Methods
    public Artwork updateArtwork(Long id, Artwork artworkDetails) {
        Artwork artwork = getArtworkById(id);
        
        artwork.setTitle(artworkDetails.getTitle());
        artwork.setDescription(artworkDetails.getDescription());
        artwork.setPrice(artworkDetails.getPrice());
        artwork.setMedium(artworkDetails.getMedium());
        artwork.setDimensions(artworkDetails.getDimensions());
        
        return artworkRepository.save(artwork);
    }

    public Artwork updateArtworkStatus(Long id, ArtworkStatus status) {
        Artwork artwork = getArtworkById(id);
        artwork.setStatus(status);
        return artworkRepository.save(artwork);
    }

    // Delete Method
    public void deleteArtwork(Long id) {
        Artwork artwork = getArtworkById(id);
        artworkRepository.delete(artwork);
    }

    // Status-specific operations
    public List<Artwork> getAvailableArtworks() {
        return artworkRepository.findByStatus(ArtworkStatus.AVAILABLE);
    }

    public List<Artwork> getExhibitionArtworks() {
        return artworkRepository.findByStatus(ArtworkStatus.ON_EXHIBITION);
    }

    public Artwork markAsSold(Long id) {
        Artwork artwork = getArtworkById(id);
        artwork.setStatus(ArtworkStatus.SOLD);
        return artworkRepository.save(artwork);
    }

    public Artwork markAsReserved(Long id) {
        Artwork artwork = getArtworkById(id);
        artwork.setStatus(ArtworkStatus.RESERVED);
        return artworkRepository.save(artwork);
    }

    public Artwork submitForReview(Long id) {
        Artwork artwork = getArtworkById(id);
        artwork.setStatus(ArtworkStatus.UNDER_REVIEW);
        return artworkRepository.save(artwork);
    }

    public Artwork archiveArtwork(Long id) {
        Artwork artwork = getArtworkById(id);
        artwork.setStatus(ArtworkStatus.ARCHIVED);
        return artworkRepository.save(artwork);
    }
}