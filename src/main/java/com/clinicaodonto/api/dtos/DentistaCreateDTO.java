package com.clinicaodonto.api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DentistaCreateDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O CRO é obrigatório")
    private String cro;

    private String especialidade;
    private String telefone;
    private String email;
}