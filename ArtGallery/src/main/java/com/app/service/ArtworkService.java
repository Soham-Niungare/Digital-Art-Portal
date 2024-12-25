package com.app.service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.exception.ForbiddenException;
import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.model.Category;
import com.app.model.Tag;
import com.app.model.User;
import com.app.model.enums.ArtworkStatus;
import com.app.repository.ArtistRepository;
import com.app.repository.ArtworkRepository;
import com.app.repository.CategoryRepository;
import com.app.repository.UserRepository;
import com.app.util.ImageUtils;

import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ArtworkService {
    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;
    @Autowired
    private UserRepository userRepository;    
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private TagService tagService;
    
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
    
    public Page<Artwork> searchArtworks(String query, List<Long> categoryIds, List<String> tagNames, Pageable pageable) {
        Specification<Artwork> spec = Specification.where(null);

        if (query != null && !query.isEmpty()) {
            spec = spec.and((root, criteriaQuery, criteriaBuilder) ->
                criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + query.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("medium")), "%" + query.toLowerCase() + "%")
                )
            );
        }

        if (categoryIds != null && !categoryIds.isEmpty()) {
            spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                Join<Artwork, Category> categoryJoin = root.join("categories");
                return categoryJoin.get("id").in(categoryIds);
            });
        }

        if (tagNames != null && !tagNames.isEmpty()) {
            spec = spec.and((root, criteriaQuery, criteriaBuilder) -> {
                Join<Artwork, Tag> tagJoin = root.join("tags");
                return tagJoin.get("name").in(tagNames);
            });
        }

        return artworkRepository.findAll(spec, pageable);
    }

    public Artwork updateCategories(Long artworkId, Set<Long> categoryIds) {
        Artwork artwork = artworkRepository.findById(artworkId)
            .orElseThrow(() -> new ResourceNotFoundException("Artwork not found"));

        Set<Category> categories = categoryRepository.findAllById(categoryIds)
            .stream()
            .collect(Collectors.toSet());

        artwork.setCategories(categories);
        return artworkRepository.save(artwork);
    }

    public Artwork updateTags(Long artworkId, Set<String> tagNames) {
        Artwork artwork = artworkRepository.findById(artworkId)
            .orElseThrow(() -> new ResourceNotFoundException("Artwork not found"));

        Set<Tag> tags = tagNames.stream()
            .map(name -> tagService.getOrCreate(name))
            .collect(Collectors.toSet());

        artwork.setTags(tags);
        return artworkRepository.save(artwork);
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