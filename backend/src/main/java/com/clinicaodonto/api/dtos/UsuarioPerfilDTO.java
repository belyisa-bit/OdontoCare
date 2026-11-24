package com.clinicaodonto.api.dtos;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UsuarioPerfilDTO {
    @Pattern(regexp = "^$|\\d{11}", message = "Informe CPF com 11 digitos")
    private String cpf;

    @Pattern(regexp = "^$|\\d{10,11}", message = "Informe telefone com DDD e 10 ou 11 digitos")
    private String telefone;

    @Past(message = "A data de nascimento deve ser anterior a hoje")
    private LocalDate dataNascimento;
}
