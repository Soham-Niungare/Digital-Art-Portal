package com.app.service;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import javax.imageio.ImageIO;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.dto.UpdateProfileRequest;
import com.app.dto.UserProfileDTO;
import com.app.dto.UserRegistrationRequest;
import com.app.model.Artist;
import com.app.model.Artwork;
import com.app.model.User;
import com.app.model.enums.Role;
import com.app.repository.UserRepository;
import com.app.util.ImageUtils;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${user.profile.images.directory}")
    private String profileImageDirectory;
    

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User registerNewUser(UserRegistrationRequest registrationDto) {
        // Check if user already exists
        if (userRepository.findByEmail(registrationDto.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with email: " + registrationDto.getEmail());
        }

        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setRole(Role.valueOf(registrationDto.getRole()));

        return userRepository.save(user);
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public UserProfileDTO getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserProfileDTO.from(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Update user fields
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        User updatedUser = userRepository.save(user);
        return UserProfileDTO.from(updatedUser);
    }
    
    @Transactional
    public String uploadProfileImage(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ImageUtils.validateProfileImage(file);

        try {
            // Compress and save image
            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            BufferedImage compressedImage = compressImage(originalImage);

            String fileName = "profile_" + user.getId() + "_" + System.currentTimeMillis() + ".jpg";
            Path filePath = Paths.get(profileImageDirectory, fileName);
            Files.createDirectories(filePath.getParent());

            // Save compressed image
            ImageIO.write(compressedImage, "jpg", filePath.toFile());

            // Update user profile picture URL
            String imageUrl = "/profile-images/" + fileName;
            user.setProfilePicture(imageUrl);
            userRepository.save(user);

            return imageUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store profile image", e);
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
