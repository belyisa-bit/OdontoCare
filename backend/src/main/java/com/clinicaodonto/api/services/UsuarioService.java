package com.clinicaodonto.api.services;

import com.clinicaodonto.api.dtos.UsuarioLoginDTO;
import com.clinicaodonto.api.dtos.UsuarioRegisterDTO;
import com.clinicaodonto.api.dtos.UsuarioResponseDTO;
import com.clinicaodonto.api.exceptions.EmailDuplicadoException;
import com.clinicaodonto.api.models.Usuario;
import com.clinicaodonto.api.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UsuarioResponseDTO registrar(UsuarioRegisterDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailDuplicadoException("E-mail já cadastrado");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome().trim());
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        Usuario salvo = usuarioRepository.save(usuario);
        return toResponse(salvo, jwtService.generateToken(salvo));
    }

    public UsuarioResponseDTO autenticar(UsuarioLoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));
        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }
        return toResponse(usuario, jwtService.generateToken(usuario));
    }

    public UsuarioResponseDTO obterPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return toResponse(usuario, null);
    }

    private UsuarioResponseDTO toResponse(Usuario usuario, String token) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setToken(token);
        return dto;
    }
}
