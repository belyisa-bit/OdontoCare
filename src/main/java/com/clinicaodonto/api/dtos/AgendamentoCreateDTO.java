package com.clinicaodonto.api.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AgendamentoCreateDTO {

    @NotBlank(message = "O nome do paciente é obrigatório")
    private String nomePaciente;

    @NotBlank(message = "O CPF do paciente é obrigatório")
    private String cpfPaciente;

    private String telefonePaciente;

    @NotNull(message = "A data e hora são obrigatórias")
    @Future(message = "A data do agendamento deve ser no futuro")
    private LocalDateTime dataHora;

    @NotBlank(message = "O tratamento é obrigatório")
    private String tratamento;

    private Long dentistaId;
}