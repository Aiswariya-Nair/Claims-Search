package com.aiswariya.Claimsproject.service;

import com.aiswariya.Claimsproject.model.Claim;
import com.aiswariya.Claimsproject.repository.ClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClaimsService {

    @Autowired
    private ClaimRepository claimRepository;

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }
}