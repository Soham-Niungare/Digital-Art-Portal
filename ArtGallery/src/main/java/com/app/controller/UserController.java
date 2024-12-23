package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.app.dto.UserRegistrationRequest;
import com.app.model.User;
import com.app.model.Artist;
import com.app.service.UserService;
import com.app.service.ArtistService;

@RestController
@RequestMapping("/api/users")
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
}