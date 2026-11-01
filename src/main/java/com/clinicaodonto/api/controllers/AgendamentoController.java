package com.clinicaodonto.api.controllers;

import com.clinicaodonto.api.dtos.AgendamentoCreateDTO;
import com.clinicaodonto.api.dtos.AgendamentoDTO;
import com.clinicaodonto.api.services.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoDTO>> listarTodos() {
        return ResponseEntity.ok(agendamentoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<AgendamentoDTO> criar(@Valid @RequestBody AgendamentoCreateDTO dto) {
        AgendamentoDTO novo = agendamentoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }
}