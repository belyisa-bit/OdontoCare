package com.clinicaodonto.api.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tb_tratamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tratamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private BigDecimal preco;

    private Integer duracaoMinutos;
}