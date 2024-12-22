package com.app.service;

import java.util.List;

import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.dto.UserRegistrationRequest;
import com.app.model.User;
import com.app.model.enums.Role;
import com.app.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public String registerUser(UserRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        // Create a new user
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setRole(Role.CUSTOMER); // Default role for new users

        // Save the user in the database
        userRepository.save(newUser);

        return "User registered successfully!";
    }

//    public User createUser(User user) {
//        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
//            throw new RuntimeException("Email already exists");
//        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return userRepository.save(user);
//    }
//
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//
//    public User getUserById(Long id) {
//        return userRepository.findById(id)
//            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//    }
//
//    public User updateUser(Long id, User userDetails) {
//        User user = getUserById(id);
//        user.setFirstName(userDetails.getFirstName());
//        user.setLastName(userDetails.getLastName());
//        user.setEmail(userDetails.getEmail());
//        if(userDetails.getPassword() != null) {
//            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
//        }
//        return userRepository.save(user);
//    }
//
//    public void deleteUser(Long id) {
//        User user = getUserById(id);
//        userRepository.delete(user);
//    }
}