package gov.nic.apar.dto;

public record LoginResponse(String token, String fullName, String email, String role) {}
