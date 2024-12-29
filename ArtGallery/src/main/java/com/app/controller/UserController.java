package com.app.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Sort;


import com.app.dto.UpdateProfileRequest;
import com.app.dto.UserProfileDTO;
import com.app.dto.UserRegistrationRequest;
import com.app.model.User;
import com.app.model.Artist;
import com.app.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.app.service.ArtistService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private ArtistService artistService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationRequest registrationDto) {
        User user = userService.registerNewUser(registrationDto);
        
        // If registering as an artist, create artist profile
        if ("ARTIST".equals(registrationDto.getRole())) {
            Artist artist = new Artist();
            artist.setUser(user);
            artist.setDisplayName(user.getFirstName() + " " + user.getLastName());
            artist.setArtistName(user.getFirstName() + " " + user.getLastName());
            artistService.createArtist(artist);
        }
        
        return ResponseEntity.ok("User registered successfully");
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDTO profile = userService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO updatedProfile = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(updatedProfile);
    }
    
    @PostMapping("/profile/image")
    public ResponseEntity<String> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        String imageUrl = userService.uploadProfileImage(userDetails.getUsername(), file);
        return ResponseEntity.ok(imageUrl);
    }

    @GetMapping("/profile/image")
    public ResponseEntity<Map<String, String>> getProfileImage(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDTO profile = userService.getCurrentUserProfile(userDetails.getUsername());
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", profile.getProfilePicture());
        return ResponseEntity.ok(response);
    }
    
}