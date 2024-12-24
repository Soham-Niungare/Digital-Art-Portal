package com.app.service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.exception.ForbiddenException;
import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.model.User;
import com.app.model.enums.ArtworkStatus;
import com.app.repository.ArtistRepository;
import com.app.repository.ArtworkRepository;
import com.app.repository.UserRepository;
import com.app.util.ImageUtils;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ArtworkService {
    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;
    @Autowired
    private UserRepository userRepository;    
    
    @Value("${artwork.images.directory}")
    private String imageDirectory;
    


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
    
    private void validateOwnership(Artwork artwork, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!artwork.getArtist().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You don't have permission to modify this artwork");
        }
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
    public Artwork updateArtwork(Long id, Artwork artworkDetails, String userEmail) {
        Artwork artwork = getArtworkById(id);
        validateOwnership(artwork, userEmail);
        
        artwork.setTitle(artworkDetails.getTitle());
        artwork.setDescription(artworkDetails.getDescription());
        artwork.setPrice(artworkDetails.getPrice());
        artwork.setMedium(artworkDetails.getMedium());
        artwork.setDimensions(artworkDetails.getDimensions());
        artwork.setStatus(artworkDetails.getStatus());
        
        return artworkRepository.save(artwork);
    }
    public Artwork updateArtworkStatus(Long id, ArtworkStatus status) {
        Artwork artwork = getArtworkById(id);
        artwork.setStatus(status);
        return artworkRepository.save(artwork);
    }

    // Delete Method
    public void deleteArtwork(Long id, String userEmail) {
        Artwork artwork = getArtworkById(id);
        validateOwnership(artwork, userEmail);
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
    
    public String uploadImage(Long id, MultipartFile file, String userEmail) {
        Artwork artwork = getArtworkById(id);
        validateOwnership(artwork, userEmail);
        ImageUtils.validateImage(file);  // Add this line

        try {
            // Compress image if needed
            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            BufferedImage compressedImage = compressImage(originalImage);
            
            String fileName = id + "_" + System.currentTimeMillis() + ".jpg";
            Path filePath = Paths.get(imageDirectory, fileName);
            Files.createDirectories(filePath.getParent());
            
            // Save compressed image
            ImageIO.write(compressedImage, "jpg", filePath.toFile());
            
            artwork.setImageUrl("/images/" + fileName);
            return artworkRepository.save(artwork).getImageUrl();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }
    
    private BufferedImage compressImage(BufferedImage originalImage) {
        // Create a new image with RGB color model
        BufferedImage compressedImage = new BufferedImage(
            originalImage.getWidth(), 
            originalImage.getHeight(),
            BufferedImage.TYPE_INT_RGB);
            
        // Draw the original image on the new one
        Graphics2D g = compressedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, null);
        g.dispose();
        
        return compressedImage;
    }
}