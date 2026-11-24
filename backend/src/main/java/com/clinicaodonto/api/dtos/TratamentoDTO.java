package com.clinicaodonto.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TratamentoDTO {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private Integer duracaoMinutos;
}