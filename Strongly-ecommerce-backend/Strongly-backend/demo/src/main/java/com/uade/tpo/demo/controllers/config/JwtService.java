package com.uade.tpo.demo.controllers.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class JwtService {
    @Value("${application.security.jwt.secretKey}")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(
            User userDetails) {
        return buildToken(userDetails, jwtExpiration);
    }

    private String buildToken(
            User userDetails,
            long expiration) {
        return Jwts
                .builder()
                .setSubject(userDetails.getUsername()) // prueba@hotmail.com
                .setIssuedAt(new Date(System.currentTimeMillis()))
                 .claim("rol", userDetails.getRole()) // <-- aquí guardamos el rol
                 .claim("id", userDetails.getId()) // <-- aquí guardamos el rol

                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSecretKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractClaim(token, Claims::getSubject);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSecretKey()) // Corrected method
                .build()
                .parseClaimsJws(token) // Corrected method
                .getBody();
    }

    private SecretKey getSecretKey() {
        SecretKey secretKeySpec = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return secretKeySpec;
    }
}