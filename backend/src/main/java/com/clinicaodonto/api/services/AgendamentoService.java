package com.clinicaodonto.api.services;

import com.clinicaodonto.api.dtos.AgendamentoCreateDTO;
import com.clinicaodonto.api.dtos.AgendamentoDTO;
import com.clinicaodonto.api.models.Agendamento;
import com.clinicaodonto.api.repositories.AgendamentoRepository;
import com.clinicaodonto.api.repositories.DentistaRepository;
import com.clinicaodonto.api.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final DentistaRepository dentistaRepository;
    private final UsuarioRepository usuarioRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository, DentistaRepository dentistaRepository,
                              UsuarioRepository usuarioRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.dentistaRepository = dentistaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<AgendamentoDTO> listarPorUsuarioAutenticado(String emailUsuario) {
        return agendamentoRepository.findByUsuarioEmailOrderByDataHoraAsc(emailUsuario).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public AgendamentoDTO obterDoUsuario(Long id, String emailUsuario) {
        return agendamentoRepository.findByIdAndUsuarioEmail(id, emailUsuario)
                .map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));
    }

    public AgendamentoDTO criar(AgendamentoCreateDTO dto, String emailUsuario) {
        Agendamento agendamento = new Agendamento();
        agendamento.setUsuario(usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Usuário autenticado não encontrado")));
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
