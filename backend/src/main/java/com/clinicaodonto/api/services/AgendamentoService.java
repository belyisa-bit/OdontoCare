
package com.clinicaodonto.api.services;

import com.clinicaodonto.api.dtos.AgendamentoCreateDTO;
import com.clinicaodonto.api.dtos.AgendamentoDTO;
import com.clinicaodonto.api.dtos.DentistaDTO;
import com.clinicaodonto.api.models.Agendamento;
import com.clinicaodonto.api.models.Dentista;
import com.clinicaodonto.api.repositories.AgendamentoRepository;
import com.clinicaodonto.api.repositories.DentistaRepository;
import com.clinicaodonto.api.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private static final String STATUS_CANCELADO = "CANCELADO";

    private final AgendamentoRepository agendamentoRepository;
    private final DentistaRepository dentistaRepository;
    private final UsuarioRepository usuarioRepository;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            DentistaRepository dentistaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.agendamentoRepository = agendamentoRepository;
        this.dentistaRepository = dentistaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<AgendamentoDTO> listarPorUsuarioAutenticado(String emailUsuario) {
        return agendamentoRepository
                .findByUsuarioEmailOrderByDataHoraAsc(emailUsuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AgendamentoDTO obterDoUsuario(Long id, String emailUsuario) {
        return agendamentoRepository.findByIdAndUsuarioEmail(id, emailUsuario)
                .map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Agendamento não encontrado"
                ));
    }

    @Transactional(readOnly = true)
    public List<LocalTime> listarHorariosOcupados(LocalDate data, Long dentistaId) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.plusDays(1).atStartOfDay().minusNanos(1);

        List<Agendamento> agendamentos;

        if (dentistaId == null) {
            agendamentos = agendamentoRepository
                    .findByDataHoraBetweenAndStatusNot(inicio, fim, STATUS_CANCELADO);
        } else {
            agendamentos = agendamentoRepository
                    .findByDentistaIdAndDataHoraBetweenAndStatusNot(
                            dentistaId,
                            inicio,
                            fim,
                            STATUS_CANCELADO
                    );
        }

        return agendamentos.stream()
                .map(agendamento -> agendamento.getDataHora().toLocalTime())
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public AgendamentoDTO criar(AgendamentoCreateDTO dto, String emailUsuario) {
        LocalDateTime dataHora = dto.getDataHora();

        validarHorario(dataHora, dto.getDentistaId());

        Agendamento agendamento = new Agendamento();

        agendamento.setUsuario(usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuário autenticado não encontrado"
                )));

        agendamento.setNomePaciente(dto.getNomePaciente());
        agendamento.setCpfPaciente(dto.getCpfPaciente());
        agendamento.setTelefonePaciente(dto.getTelefonePaciente());
        agendamento.setDataHora(dataHora);
        agendamento.setTratamento(dto.getTratamento());
        agendamento.setStatus("PENDENTE");

        if (dto.getDentistaId() != null) {
            Dentista dentista = dentistaRepository.findById(dto.getDentistaId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Dentista não encontrado"
                    ));

            agendamento.setDentista(dentista);
        }

        Agendamento salvo = agendamentoRepository.save(agendamento);
        return toDTO(salvo);
    }

    private void validarHorario(LocalDateTime dataHora, Long dentistaId) {
        if (dataHora == null || !dataHora.isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Escolha uma data e horário futuros"
            );
        }

        LocalTime horario = dataHora.toLocalTime();

        boolean intervaloValido = horario.getMinute() % 30 == 0
                && horario.getSecond() == 0
                && horario.getNano() == 0;

        boolean horarioManha = !horario.isBefore(LocalTime.of(8, 0))
                && horario.isBefore(LocalTime.of(12, 0));

        boolean horarioTarde = !horario.isBefore(LocalTime.of(14, 0))
                && horario.isBefore(LocalTime.of(18, 0));

        if (!intervaloValido || (!horarioManha && !horarioTarde)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Horário fora do funcionamento da clínica"
            );
        }

        boolean ocupado = dentistaId == null
                ? agendamentoRepository.existsByDataHoraAndStatusNot(
                        dataHora,
                        STATUS_CANCELADO
                )
                : agendamentoRepository.existsByDentistaIdAndDataHoraAndStatusNot(
                        dentistaId,
                        dataHora,
                        STATUS_CANCELADO
                );

        if (ocupado) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este horário já está ocupado. Escolha outro."
            );
        }
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
            Dentista dentista = entity.getDentista();

            dto.setDentistaId(dentista.getId());
            dto.setDentista(new DentistaDTO(
                    dentista.getId(),
                    dentista.getNome(),
                    dentista.getCro(),
                    dentista.getEspecialidade(),
                    dentista.getTelefone(),
                    dentista.getEmail(),
                    dentista.getFotoUrl()
            ));
        }

        return dto;
    }
}
