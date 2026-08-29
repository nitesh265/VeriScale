package com.verification.system.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // ==========================================
    // JWT SECRET KEY
    // ==========================================

    private SecretKey getKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            String userId,
            String email,
            String role
    ) {

        return Jwts.builder()
                .subject(userId)

                .claim("email", email)
                .claim("role", role)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(getKey())

                .compact();
    }

    // ==========================================
    // EXTRACT USER ID
    // ==========================================

    public String extractUserId(String token) {

        return getClaims(token)
                .getSubject();
    }

    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean isValid(String token) {

        try {

            Claims claims = getClaims(token);

            return claims
                    .getExpiration()
                    .after(new Date());

        } catch (Exception e) {

            return false;
        }
    }

    // ==========================================
    // GET CLAIMS FOR AUTHENTICATION
    // ==========================================

    public Claims getClaimsForAuthentication(
            String token
    ) {

        return getClaims(token);
    }

    // ==========================================
    // GET ALL CLAIMS
    // ==========================================

    private Claims getClaims(String token) {

        return Jwts.parser()

                .verifyWith(getKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}