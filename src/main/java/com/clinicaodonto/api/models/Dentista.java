package com.clinicaodonto.api.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_dentistas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Dentista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cro;

    private String especialidade;
    private String telefone;
    private String email;
}