package com.clinicaodonto.api.services;

import com.clinicaodonto.api.dtos.AgendamentoCreateDTO;
import com.clinicaodonto.api.dtos.AgendamentoDTO;
import com.clinicaodonto.api.models.Agendamento;
import com.clinicaodonto.api.repositories.AgendamentoRepository;
import com.clinicaodonto.api.repositories.DentistaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final DentistaRepository dentistaRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository, DentistaRepository dentistaRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.dentistaRepository = dentistaRepository;
    }

    public List<AgendamentoDTO> listarPorUsuarioAutenticado(String emailUsuario) {
    return agendamentoRepository.findByUsuarioEmail(emailUsuario).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
}

    public AgendamentoDTO criar(AgendamentoCreateDTO dto) {
        Agendamento agendamento = new Agendamento();
        agendamento.setNomePaciente(dto.getNomePaciente());
        agendamento.setCpfPaciente(dto.getCpfPaciente());
        agendamento.setTelefonePaciente(dto.getTelefonePaciente());
        agendamento.setDataHora(dto.getDataHora());
        agendamento.setTratamento(dto.getTratamento());
        agendamento.setStatus("PENDENTE");

        if (dto.getDentistaId() != null) {
            dentistaRepository.findById(dto.getDentistaId())
                    .ifPresent(agendamento::setDentista);
        }

        Agendamento salvo = agendamentoRepository.save(agendamento);
        return toDTO(salvo);
    }

    private AgendamentoDTO toDTO(Agendamento entity) {
        AgendamentoDTO dto = new AgendamentoDTO();
        dto.setId(entity.getId());
        dto.setNomePaciente(entity.getNomePaciente());
        dto.setCpfPaciente(entity.getCpfPaciente());
        dto.setTelefonePaciente(entity.getTelefonePaciente());
        dto.setDataHora(entity.getDataHora());
        dto.setTratamento(entity.getTratamento());
        dto.setStatus(entity.getStatus());
        if (entity.getDentista() != null) {
            dto.setDentistaId(entity.getDentista().getId());
        }
        return dto;
    }
}