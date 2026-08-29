package com.verification.system.security;

import io.jsonwebtoken.Claims;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        String header =
                request.getHeader("Authorization");

        // ==========================================
        // NO TOKEN
        // ==========================================

        if (
                header == null ||
                !header.startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        String token =
                header.substring(7);

        try {

            // ==========================================
            // VALIDATE TOKEN
            // ==========================================

            if (jwtService.isValid(token)) {

                // ==========================================
                // GET USER ID
                // ==========================================

                String userId =
                        jwtService.extractUserId(token);

                // ==========================================
                // GET JWT CLAIMS
                // ==========================================

                Claims claims =
                        jwtService
                                .getClaimsForAuthentication(
                                        token
                                );

                // ==========================================
                // GET ROLE
                // ==========================================

                String role =
                        claims.get(
                                "role",
                                String.class
                        );

                // ==========================================
                // MAKE SURE ROLE EXISTS
                // ==========================================

                if (role != null) {

                    // ==========================================
                    // CREATE SPRING AUTHENTICATION
                    // ==========================================

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(

                                    userId,

                                    null,

                                    List.of(
                                            new SimpleGrantedAuthority(
                                                    "ROLE_"
                                                            + role.toUpperCase()
                                            )
                                    )
                            );

                    // ==========================================
                    // SET AUTHENTICATION
                    // ==========================================

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );

                    // ==========================================
                    // DEBUG LOG
                    // ==========================================

                    System.out.println(
                            "JWT authenticated: "
                                    + userId
                                    + " ROLE_"
                                    + role.toUpperCase()
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT authentication failed: "
                            + e.getMessage()
            );
        }

        // ==========================================
        // CONTINUE REQUEST
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}