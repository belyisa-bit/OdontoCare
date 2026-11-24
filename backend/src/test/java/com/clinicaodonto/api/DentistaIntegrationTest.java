package com.clinicaodonto.api;

import com.clinicaodonto.api.repositories.DentistaRepository;
import com.clinicaodonto.api.services.DentistaDataInitializer;
import com.clinicaodonto.api.models.Dentista;
import org.springframework.transaction.annotation.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DentistaIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DentistaRepository dentistaRepository;

    @Autowired
    private DentistaDataInitializer initializer;

    @Test
    @Transactional
    void completaCargaParcialSemDuplicarOuAlterarCadastros() {
        Dentista existente = dentistaRepository.findAllByOrderByIdAsc().getFirst();
        existente.setTelefone("11999999999");
        dentistaRepository.save(existente);
        Dentista removido = dentistaRepository.findAllByOrderByIdAsc().getLast();
        dentistaRepository.delete(removido);
        dentistaRepository.flush();

        initializer.run();
        initializer.run();

        org.junit.jupiter.api.Assertions.assertEquals(12, dentistaRepository.count());
        org.junit.jupiter.api.Assertions.assertEquals("11999999999",
                dentistaRepository.findById(existente.getId()).orElseThrow().getTelefone());
        org.junit.jupiter.api.Assertions.assertTrue(dentistaRepository.findAll().stream()
                .anyMatch(dentista -> removido.getNome().equals(dentista.getNome())));
    }

    @Test
    void carregaDentistasNoBancoEListaSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/dentistas").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(12)))
                .andExpect(jsonPath("$[0].nome").value("Dra. Ana Bezerra"))
                .andExpect(jsonPath("$[0].fotoUrl").value("/assets/images/retratos/ana-bezerra.webp"));

        org.junit.jupiter.api.Assertions.assertEquals(12, dentistaRepository.count());
    }

    @Test
    void buscaDentistaPorIdEInformaQuandoNaoExiste() throws Exception {
        mockMvc.perform(get("/api/dentistas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Dra. Ana Bezerra"));

        mockMvc.perform(get("/api/dentistas/999"))
                .andExpect(status().isNotFound());
    }
}
