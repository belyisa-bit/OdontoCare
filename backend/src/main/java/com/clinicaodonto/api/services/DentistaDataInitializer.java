package com.clinicaodonto.api.services;

import com.clinicaodonto.api.models.Dentista;
import com.clinicaodonto.api.repositories.DentistaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DentistaDataInitializer implements CommandLineRunner {

    private final DentistaRepository dentistaRepository;

    public DentistaDataInitializer(DentistaRepository dentistaRepository) {
        this.dentistaRepository = dentistaRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        var existentes = dentistaRepository.findAll();
        var iniciais = List.of(
                dentista("Dra. Ana Bezerra", "Ortodontia", "ana-bezerra"),
                dentista("Dr. Lucas Martins", "Implantodontia", "lucas-martins"),
                dentista("Dra. Carla Santos", "Clínico geral", "carla-santos"),
                dentista("Dr. Renato Lima", "Periodontia", "renato-lima"),
                dentista("Dra. Juliana Costa", "Endodontia", "juliana-costa"),
                dentista("Dr. Rafael Mendes", "Odontopediatria", "rafael-mendes"),
                dentista("Dra. Fernanda Alves", "Cirurgia bucomaxilofacial", "fernanda-alves"),
                dentista("Dr. Pedro Oliveira", "Prótese dentária", "pedro-oliveira"),
                dentista("Dra. Camila Rocha", "Dentística", "camila-rocha"),
                dentista("Dr. Bruno Ferreira", "Radiologia odontológica", "bruno-ferreira"),
                dentista("Dra. Marina Souza", "Ortodontia", "marina-souza"),
                dentista("Dr. André Ribeiro", "Clínico geral", "andre-ribeiro")
        );
        dentistaRepository.saveAll(iniciais.stream()
                .filter(inicial -> existentes.stream().noneMatch(existente ->
                        inicial.getNome().equals(existente.getNome())
                                && inicial.getEspecialidade().equals(existente.getEspecialidade())))
                .toList());
    }

    private Dentista dentista(String nome, String especialidade, String foto) {
        Dentista dentista = new Dentista();
        dentista.setNome(nome);
        dentista.setEspecialidade(especialidade);
        dentista.setFotoUrl("/assets/images/retratos/" + foto + ".webp");
        return dentista;
    }
}
