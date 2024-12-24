package com.app.util;

import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.imageio.ImageIO;

public class ImageUtils {
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png");
    private static final int MIN_WIDTH = 400;
    private static final int MAX_WIDTH = 4096;
    private static final int MIN_HEIGHT = 400;
    private static final int MAX_HEIGHT = 4096;

    public static void validateImage(MultipartFile file) {
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        // Check file extension
        String extension = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Only JPG, JPEG, PNG files are allowed");
        }

        // Check dimensions
        try {
            BufferedImage img = ImageIO.read(file.getInputStream());
            if (img.getWidth() < MIN_WIDTH || img.getWidth() > MAX_WIDTH ||
                img.getHeight() < MIN_HEIGHT || img.getHeight() > MAX_HEIGHT) {
                throw new IllegalArgumentException(
                    "Image dimensions must be between " + MIN_WIDTH + "x" + MIN_HEIGHT + 
                    " and " + MAX_WIDTH + "x" + MAX_HEIGHT + " pixels");
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Invalid image file");
        }
    }

    private static String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}