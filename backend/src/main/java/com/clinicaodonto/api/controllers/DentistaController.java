package com.clinicaodonto.api.controllers;

import com.clinicaodonto.api.dtos.DentistaDTO;
import com.clinicaodonto.api.services.DentistaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dentistas")
public class DentistaController {

    private final DentistaService dentistaService;

    public DentistaController(DentistaService dentistaService) {
        this.dentistaService = dentistaService;
    }

    @GetMapping
    public ResponseEntity<List<DentistaDTO>> listar() {
        return ResponseEntity.ok(dentistaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DentistaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(dentistaService.buscarPorId(id));
    }
}
