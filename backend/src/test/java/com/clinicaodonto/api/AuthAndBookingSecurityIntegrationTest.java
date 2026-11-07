package com.clinicaodonto.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthAndBookingSecurityIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Value("${jwt.secret}") private String testSecret;

    @Test
    void registrationDuplicateAndLoginReturnExpectedStatuses() throws Exception {
        String email = email("auth");
        var registration = registrationPayload(email);
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registration))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.token").isNotEmpty());
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registration))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"));

        String login = objectMapper.writeValueAsString(new Login(email, "Senha@Forte2026"));
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(login))
                .andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty());
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new Login(email, "senha-errada"))))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void meRejectsInvalidAndExpiredTokensAndAcceptsValidToken() throws Exception {
        String email = email("me");
        var registration = objectMapper.readTree(register(email));
        String validToken = registration.get("token").asText();
        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.email").value(email));
        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));

        String expired = Jwts.builder().setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis() - 10_000))
                .setExpiration(new Date(System.currentTimeMillis() - 1_000))
                .signWith(Keys.hmacShaKeyFor(testSecret.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + expired))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void usersCanOnlyListAndReadTheirOwnBookings() throws Exception {
        String emailA = email("owner-a");
        String emailB = email("owner-b");
        String tokenA = objectMapper.readTree(register(emailA)).get("token").asText();
        String tokenB = objectMapper.readTree(register(emailB)).get("token").asText();

        String booking = """
                {"nomePaciente":"Paciente A","cpfPaciente":"12345678901","telefonePaciente":"85999990000",
                 "dataHora":"%s","tratamento":"Limpeza","usuarioId":999999}
                """.formatted(LocalDateTime.now().plusDays(1).withNano(0));
        String created = mockMvc.perform(post("/api/agendamentos").header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON).content(booking))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        JsonNode createdJson = objectMapper.readTree(created);
        long bookingId = createdJson.get("id").asLong();

        mockMvc.perform(get("/api/agendamentos").header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value(bookingId));
        mockMvc.perform(get("/api/agendamentos").header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk()).andExpect(jsonPath("$").isEmpty());
        mockMvc.perform(get("/api/agendamentos/" + bookingId).header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(bookingId));
        mockMvc.perform(get("/api/agendamentos/" + bookingId).header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.status").value(404));
    }

    private String register(String email) throws Exception {
        return mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registrationPayload(email)))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
    }

    private String registrationPayload(String email) throws Exception {
        return objectMapper.writeValueAsString(new Registration("Paciente Teste", email, "Senha@Forte2026"));
    }

    private String email(String label) {
        return label + "+" + UUID.randomUUID() + "@example.test";
    }

    private record Registration(String nome, String email, String senha) {}
    private record Login(String email, String senha) {}
}
