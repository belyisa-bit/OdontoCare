
package com.clinicaodonto.api.controllers;

import com.clinicaodonto.api.dtos.AgendamentoCreateDTO;
import com.clinicaodonto.api.dtos.AgendamentoDTO;
import com.clinicaodonto.api.services.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoDTO>> listarTodos(Authentication authentication) {
        return ResponseEntity.ok(
                agendamentoService.listarPorUsuarioAutenticado(authentication.getName())
        );
    }

    @GetMapping("/disponibilidade")
    public ResponseEntity<List<LocalTime>> listarHorariosOcupados(
            @RequestParam LocalDate data,
            @RequestParam(required = false) Long dentistaId
    ) {
        return ResponseEntity.ok(
                agendamentoService.listarHorariosOcupados(data, dentistaId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoDTO> obter(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                agendamentoService.obterDoUsuario(id, authentication.getName())
        );
    }

    @PostMapping
    public ResponseEntity<AgendamentoDTO> criar(
            @Valid @RequestBody AgendamentoCreateDTO dto,
            Authentication authentication
    ) {
        AgendamentoDTO novo = agendamentoService.criar(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }
}
