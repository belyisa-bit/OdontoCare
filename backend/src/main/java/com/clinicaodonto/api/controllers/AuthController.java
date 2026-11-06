package com.clinicaodonto.api.controllers;

import com.clinicaodonto.api.dtos.UsuarioLoginDTO;
import com.clinicaodonto.api.dtos.UsuarioRegisterDTO;
import com.clinicaodonto.api.dtos.UsuarioResponseDTO;
import com.clinicaodonto.api.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> registrar(@Valid @RequestBody UsuarioRegisterDTO dto) {
        return ResponseEntity.status(201).body(usuarioService.registrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(@Valid @RequestBody UsuarioLoginDTO dto) {
        return ResponseEntity.ok(usuarioService.autenticar(dto));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> me(Authentication authentication) {
        return ResponseEntity.ok(usuarioService.obterPorEmail(authentication.getName()));
    }
}
