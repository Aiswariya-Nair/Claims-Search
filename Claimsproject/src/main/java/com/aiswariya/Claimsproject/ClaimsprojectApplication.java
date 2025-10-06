package com.aiswariya.Claimsproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.aiswariya.Claimsproject.model")
@EnableJpaRepositories(basePackages = "com.aiswariya.Claimsproject.repository")
public class ClaimsprojectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClaimsprojectApplication.class, args);
    }
}