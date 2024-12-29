package com.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${artwork.images.directory}")
    private String uploadDir;

    @Value("${user.profile.images.directory}")
    private String profileUploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // artwork images handler
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(3600); // Cache for 1 hour
        
        // profile images handler
        registry.addResourceHandler("/profile-images/**")
                .addResourceLocations("file:" + profileUploadDir + "/")
                .setCachePeriod(3600);
    }
}