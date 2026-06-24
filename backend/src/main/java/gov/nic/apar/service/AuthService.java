package gov.nic.apar.service;

import gov.nic.apar.dto.LoginRequest;
import gov.nic.apar.dto.LoginResponse;
import gov.nic.apar.entity.User;
import gov.nic.apar.exception.NotFoundException;
import gov.nic.apar.repository.UserRepository;
import gov.nic.apar.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new NotFoundException("User not found"));
        String token = jwtService.generateToken(user.getEmail(),
                Map.of("role", user.getRole().name(), "name", user.getFullName()));
        return new LoginResponse(token, user.getFullName(), user.getEmail(), user.getRole().name());
    }
}
