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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Test
    void devePersistirPerfilEValidarDados() throws Exception {
        String cadastro = """
                {"nome":"Perfil Teste","email":"perfil.integration@odontocare.com","senha":"Senha@Forte2026"}
                """;
        String resposta = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON).content(cadastro))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String token = objectMapper.readTree(resposta).get("token").asText();
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/auth/me")
                .header("Authorization", "Bearer " + token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"telefone\":\"11999998888\",\"dataNascimento\":\"2000-05-20\"}"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.telefone").value("11999998888"))
                .andExpect(jsonPath("$.dataNascimento").value("2000-05-20"));
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/auth/me")
                .header("Authorization", "Bearer " + token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"telefone\":\"123\",\"dataNascimento\":\"2999-01-01\"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/auth/me")
                .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
    }

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
