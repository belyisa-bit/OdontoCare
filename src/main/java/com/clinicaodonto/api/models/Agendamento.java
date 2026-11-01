package com.clinicaodonto.api.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_agendamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomePaciente;

    @Column(nullable = false)
    private String cpfPaciente;

    private String telefonePaciente;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private String tratamento;

    @ManyToOne
    @JoinColumn(name = "dentista_id")
    private Dentista dentista;

    private String status; // Ex: "PENDENTE", "CONFIRMADO", "CANCELADO"
}