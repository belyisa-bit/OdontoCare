package com.clinicaodonto.api;

import com.clinicaodonto.api.dtos.UsuarioLoginDTO;
import com.clinicaodonto.api.dtos.UsuarioRegisterDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Deve cadastrar um usuário com sucesso")
    void deveCadastrarUsuario() throws Exception {
        UsuarioRegisterDTO dto = new UsuarioRegisterDTO();
        dto.setNome("Isabelle Teste");
        dto.setEmail("teste.sucesso@odontocare.com");
        dto.setSenha("Senha@Forte2026");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    @DisplayName("Deve retornar 409 ao cadastrar e-mail duplicado")
    void deveRetornar409EmailDuplicado() throws Exception {
        UsuarioRegisterDTO dto = new UsuarioRegisterDTO();
        dto.setNome("Isabelle Duplicada");
        dto.setEmail("duplicado@odontocare.com");
        dto.setSenha("Senha@Forte2026");

        // Primeiro cadastro
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)));

        // Segundo cadastro (duplicado)
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    @DisplayName("Deve retornar 401 ao acessar rota protegida sem autenticação")
    void deveRetornar401SemToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("Deve retornar 401 para credenciais de login inválidas")
    void deveRetornar401LoginInvalido() throws Exception {
        UsuarioLoginDTO dto = new UsuarioLoginDTO();
        dto.setEmail("inexistente@odontocare.com");
        dto.setSenha("SenhaIncorreta123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized());
    }
}