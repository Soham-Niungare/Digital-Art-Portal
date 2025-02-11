package com.app.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private Key dynamicSecretKey;

    @Value("${jwt.expiration}")
    private Long expiration;

    @jakarta.annotation.PostConstruct
    public void initializeSecretKey() {
        dynamicSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Generate a random secret key
    }

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Refresh the key every 24 hours
    public void refreshSecretKey() {
        dynamicSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        System.out.println("Secret key refreshed!");
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Add authorities to claims
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("");
                
        logger.info("Generating token for user: {} with role: {}", userDetails.getUsername(), role);
        claims.put("role", role);
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        String role = claims.get("role", String.class);
        logger.info("Extracted role from token: {}", role);
        return role;
    }
    
    private Key getSignKey() {
        return dynamicSecretKey;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        final String tokenRole = extractRole(token);
        boolean isValid = username.equals(userDetails.getUsername()) && 
                !isTokenExpired(token) && 
                userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals(tokenRole));
                    
        logger.info("Token validation for user: {}, role: {}, isValid: {}", username, tokenRole, isValid);
        return isValid;
    }
}
