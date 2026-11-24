package com.clinicaodonto.api.services;

import com.clinicaodonto.api.dtos.DentistaDTO;
import com.clinicaodonto.api.models.Dentista;
import com.clinicaodonto.api.repositories.DentistaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DentistaService {

    private final DentistaRepository dentistaRepository;

    public DentistaService(DentistaRepository dentistaRepository) {
        this.dentistaRepository = dentistaRepository;
    }

    public List<DentistaDTO> listar() {
        return dentistaRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public DentistaDTO buscarPorId(Long id) {
        return dentistaRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Dentista não encontrado"
                ));
    }

    private DentistaDTO toDTO(Dentista dentista) {
        return new DentistaDTO(
                dentista.getId(),
                dentista.getNome(),
                dentista.getCro(),
                dentista.getEspecialidade(),
                dentista.getTelefone(),
                dentista.getEmail(),
                dentista.getFotoUrl()
        );
    }
}
