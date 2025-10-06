package com.aiswariya.Claimsproject.controller;

import com.aiswariya.Claimsproject.model.Claim;
import com.aiswariya.Claimsproject.service.ClaimsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class ClaimsController {

    @Autowired
    private ClaimsService claimsService;

    // Add root endpoint to prevent whitelabel error
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Claims Backend API is running");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/claims")
    public ResponseEntity<List<Claim>> getAllClaims() {
        try {
            List<Claim> claims = claimsService.getAllClaims();
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}