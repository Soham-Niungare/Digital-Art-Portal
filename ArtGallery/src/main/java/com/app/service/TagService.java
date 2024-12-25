package com.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.model.Tag;
import com.app.repository.TagRepository;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public Tag getOrCreate(String name) {
        return tagRepository.findByName(name)
            .orElseGet(() -> tagRepository.save(new Tag(name)));
    }
}