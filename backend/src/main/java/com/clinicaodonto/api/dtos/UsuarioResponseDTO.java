package com.clinicaodonto.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String token;
    private String telefone;
    private String cpf;
    private java.time.LocalDate dataNascimento;
}
