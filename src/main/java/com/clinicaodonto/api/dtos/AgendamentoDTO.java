package com.clinicaodonto.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoDTO {
    private Long id;
    private String nomePaciente;
    private String cpfPaciente;
    private String telefonePaciente;
    private LocalDateTime dataHora;
    private String tratamento;
    private String status;
    private DentistaDTO dentista;
}