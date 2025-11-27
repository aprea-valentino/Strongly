package com.uade.tpo.demo.controllers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.uade.tpo.demo.entity.enums.Role;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
            // Endpoints públicos                                 
            .requestMatchers("/api/v1/auth/**").permitAll() // auth
            .requestMatchers("/error/**").permitAll() // manejo de errores
            .requestMatchers(HttpMethod.GET,"/api/v1/product/**").permitAll() // listar productos 
            .requestMatchers(HttpMethod.GET,"/api/v1/categories/**").permitAll() // categorías 
            .requestMatchers(HttpMethod.GET,"/api/v1/offers/**").permitAll() // ofertas 
            .requestMatchers(HttpMethod.GET,"/api/v1/brands/**").permitAll() // marcas 
            .requestMatchers(HttpMethod.GET,"/api/v1/support/**").permitAll() // soporte 
            // Endpoints solo para compradores                                
            .requestMatchers("/api/v1/cart/**").hasAnyAuthority(Role.BUYER.name()) // carrito
            .requestMatchers("/api/v1/orders/**").hasAuthority(Role.BUYER.name()) // órdenes
            .requestMatchers("/api/v1/users/profile/**").hasAuthority(Role.BUYER.name()) // perfil
            // Endpoints solo para vendedores/admin
            .requestMatchers(HttpMethod.POST,"/api/v1/categories/**").hasAnyAuthority(Role.SELLER.name(), Role.ADMIN.name()) // crear productos

            .requestMatchers(HttpMethod.POST,"/api/v1/product/**").hasAnyAuthority(Role.SELLER.name(), Role.ADMIN.name()) // crear productos
            .requestMatchers(HttpMethod.PUT,"/api/v1/product/**").hasAnyAuthority(Role.SELLER.name(), Role.ADMIN.name()) // actualizar productos                                
            .requestMatchers("/api/v1/inventory/**").hasAnyAuthority(Role.SELLER.name(), Role.ADMIN.name()) // inventario
            .requestMatchers(HttpMethod.POST,"/api/v1/offers/create/**").hasAnyAuthority(Role.SELLER.name(), Role.ADMIN.name()) // crear ofertas
            .requestMatchers(HttpMethod.PUT,"/api/v1/offers/create/**").hasAnyAuthority(Role.SELLER.name(), Role.ADMIN.name()) // crear ofertas
            // Endpoints solo para admin
            .requestMatchers(HttpMethod.DELETE,"/api/v1/product/**").hasAuthority(Role.ADMIN.name()) // eliminar productos
            .requestMatchers("/api/v1/users/**").hasAnyAuthority(Role.ADMIN.name(),Role.SELLER.name(), Role.BUYER.name()) // gestión de usuarios
            .requestMatchers(HttpMethod.DELETE,"/api/v1/offers/**").hasAuthority(Role.ADMIN.name()) // eliminar ofertas
            .anyRequest()
            .authenticated()
        )
        .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}



}