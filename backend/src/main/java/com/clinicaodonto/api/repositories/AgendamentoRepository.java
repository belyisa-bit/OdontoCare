
package com.clinicaodonto.api.repositories;

import com.clinicaodonto.api.models.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByCpfPaciente(String cpfPaciente);

    List<Agendamento> findByUsuarioEmailOrderByDataHoraAsc(String email);

    java.util.Optional<Agendamento> findByIdAndUsuarioEmail(Long id, String email);

    List<Agendamento> findByDataHoraBetweenAndStatusNot(
            LocalDateTime inicio,
            LocalDateTime fim,
            String status
    );

    List<Agendamento> findByDentistaIdAndDataHoraBetweenAndStatusNot(
            Long dentistaId,
            LocalDateTime inicio,
            LocalDateTime fim,
            String status
    );

    boolean existsByDataHoraAndStatusNot(LocalDateTime dataHora, String status);

    boolean existsByDentistaIdAndDataHoraAndStatusNot(
            Long dentistaId,
            LocalDateTime dataHora,
            String status
    );
}
