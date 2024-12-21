package com.app.service;

import java.util.List;

import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.app.model.Artist;
import com.app.model.User;
import com.app.repository.ArtistRepository;
import com.app.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;

    public ArtistService(ArtistRepository artistRepository, UserRepository userRepository) {
        this.artistRepository = artistRepository;
        this.userRepository = userRepository;
    }

    public Artist createArtist(Artist artist, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        artist.setUser(user);
        return artistRepository.save(artist);
    }

    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    public Artist getArtistById(Long id) {
        return artistRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
    }

    public Artist updateArtist(Long id, Artist artistDetails) {
        Artist artist = getArtistById(id);
        artist.setArtistName(artistDetails.getArtistName());
        artist.setDisplayName(artistDetails.getDisplayName());
        artist.setBiography(artistDetails.getBiography());
        artist.setSpecialization(artistDetails.getSpecialization());
        return artistRepository.save(artist);
    }

    public void deleteArtist(Long id) {
        Artist artist = getArtistById(id);
        artistRepository.delete(artist);
    }
}