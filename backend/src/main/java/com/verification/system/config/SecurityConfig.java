// package com.verification.system.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

//         http
//             .cors(cors -> cors.configurationSource(corsConfigurationSource()))

//             .csrf(csrf -> csrf.disable())

//             .sessionManagement(session ->
//                 session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//             )

//             .authorizeHttpRequests(auth -> auth

//                 // Authentication APIs
//                 .requestMatchers("/api/auth/**").permitAll()

//                 // OPTIONS request for CORS
//                 .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                   // Applicant instruments
//                 // .requestMatchers("/api/instruments/**").authenticated()
// .requestMatchers("/api/instruments/**").permitAll()
//                 // Everything else requires authentication
//                 .anyRequest().authenticated()
//             );

//         return http.build();
//     }

//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {

//         CorsConfiguration configuration = new CorsConfiguration();

//       configuration.setAllowedOrigins(
//     List.of(
//         "http://localhost:3000",
//         "http://localhost:5173"
//     )
// );

//         configuration.setAllowedMethods(
//             List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
//         );

//         configuration.setAllowedHeaders(
//             List.of("*")
//         );

//         configuration.setAllowCredentials(true);

//         UrlBasedCorsConfigurationSource source =
//             new UrlBasedCorsConfigurationSource();

//         source.registerCorsConfiguration("/**", configuration);

//         return source;
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
// }

package com.verification.system.config;

import com.verification.system.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

            // =========================
            // CORS
            // =========================
            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )

            // =========================
            // CSRF
            // =========================
            .csrf(csrf ->
                csrf.disable()
            )

            // =========================
            // JWT = STATELESS
            // =========================
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // =========================
            // AUTHORIZATION
            // =========================
            .authorizeHttpRequests(auth -> auth

                // Public authentication APIs
                .requestMatchers("/api/auth/**")
                .permitAll()

                // CORS preflight
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                )
                .permitAll()

                // =========================
                // PUBLIC APPLICANTS API
                // =========================
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/users/applicants"
                )
                .permitAll()

                // =========================
                // ADMIN APIs
                // =========================
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

                // Other users APIs require ADMIN
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/users/**"
                )
                .hasRole("ADMIN")

                // =========================
                // INSTRUMENTS
                // =========================
                .requestMatchers(
                    "/api/instruments/**"
                )
                .authenticated()

                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest()
                .authenticated()
            )

            // =========================
            // JWT FILTER
            // =========================
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // =========================
    // CORS CONFIGURATION
    // =========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:3000",
                "http://localhost:5173"
            )
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }

    // =========================
    // PASSWORD ENCODER
    // =========================
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}