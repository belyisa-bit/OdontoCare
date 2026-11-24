package com.clinicaodonto.api;

import com.clinicaodonto.api.repositories.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AuthPersistenceTests {

    @TempDir
    Path directory;

    @Test
    void registeredAccountSurvivesAnApplicationRestart() throws Exception {
        String databaseUrl = "jdbc:h2:file:" + directory.resolve("accounts").toString().replace('\\', '/')
                + ";MODE=PostgreSQL;DB_CLOSE_ON_EXIT=FALSE";
        String email = "persistence@example.test";
        String password = "Sorriso@2026";
        HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        long id;

        try (var first = start(databaseUrl)) {
            var mapper = first.getBean(ObjectMapper.class);
            var response = post(client, first, "/api/auth/register", mapper.writeValueAsString(
                    Map.of("nome", "Paciente de teste", "email", email, "senha", password)));
            assertEquals(201, response.statusCode());
            id = mapper.readTree(response.body()).get("id").asLong();

            var saved = first.getBean(UsuarioRepository.class).findByEmail(email).orElseThrow();
            assertNotEquals(password, saved.getSenha());
            assertTrue(first.getBean(PasswordEncoder.class).matches(password, saved.getSenha()));
        }

        assertTrue(Files.exists(directory.resolve("accounts.mv.db")));

        try (var restarted = start(databaseUrl)) {
            var mapper = restarted.getBean(ObjectMapper.class);
            var response = post(client, restarted, "/api/auth/login", mapper.writeValueAsString(
                    Map.of("email", email, "senha", password)));
            assertEquals(200, response.statusCode());
            var body = mapper.readTree(response.body());
            assertEquals(id, body.get("id").asLong());
            assertEquals(email, body.get("email").asText());
            assertFalse(body.get("token").asText().isBlank());

            var request = HttpRequest.newBuilder(uri(restarted, "/api/auth/me"))
                    .timeout(Duration.ofSeconds(10))
                    .header("Authorization", "Bearer " + body.get("token").asText())
                    .GET().build();
            var me = client.send(request, HttpResponse.BodyHandlers.ofString());
            assertEquals(200, me.statusCode());
            assertEquals(email, mapper.readTree(me.body()).get("email").asText());
        }
    }

    private ServletWebServerApplicationContext start(String databaseUrl) {
        return (ServletWebServerApplicationContext) new SpringApplicationBuilder(ClinicaOdontoApiApplication.class)
                .run("--server.port=0", "--spring.datasource.url=" + databaseUrl,
                        "--spring.datasource.username=sa", "--spring.datasource.password=",
                        "--spring.datasource.driver-class-name=org.h2.Driver",
                        "--spring.jpa.hibernate.ddl-auto=update", "--spring.h2.console.enabled=false",
                        "--logging.level.root=WARN", "--spring.main.banner-mode=off");
    }

    private URI uri(ServletWebServerApplicationContext context, String endpoint) {
        return URI.create("http://127.0.0.1:" + context.getWebServer().getPort() + endpoint);
    }

    private HttpResponse<String> post(HttpClient client, ServletWebServerApplicationContext context,
                                      String endpoint, String json) throws Exception {
        var request = HttpRequest.newBuilder(uri(context, endpoint)).timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json)).build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
