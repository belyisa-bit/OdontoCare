import type { OnInit } from '@angular/core';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonIcon, IonSkeletonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, personOutline, refreshOutline } from 'ionicons/icons';

import { CpfPipe } from '../../shared/pipes/cpf-pipe';
import { TelefonePipe } from '../../shared/pipes/telefone-pipe';
import { DataHoraPipe } from '../../shared/pipes/data-hora-pipe';
import type { Agendamento } from '../../core/models/agendamento.model';
import { AgendamentosService } from '../../core/services/agendamentos.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';

interface Horario {
  inicio: string;
  fim: string;
  ocupado: boolean;
  passado: boolean;
}

@Component({
  selector: 'app-agendamentos',
  templateUrl: './agendamentos.page.html',
  styleUrls: ['./agendamentos.page.scss'],
  imports: [
    CpfPipe,
    TelefonePipe,
    DataHoraPipe,
    PageHeaderComponent,
    SiteFooterComponent,
    RouterLink,
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonSkeletonText,
  ],
})
export class AgendamentosPage implements OnInit {
  private readonly service = inject(AgendamentosService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  private requestVersion = 0;
  private availabilityVersion = 0;

  readonly agendamentos = signal<Agendamento[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showForm = signal(false);
  readonly enviando = signal(false);
  readonly sucesso = signal(false);
  readonly formError = signal('');

  readonly dentistaId = signal<number | null>(null);
  readonly selectedDate = signal(this.getToday());
  readonly occupiedTimes = signal<string[]>([]);
  readonly loadingSlots = signal(false);
  readonly availabilityError = signal(false);

  readonly minDate = this.getToday();

  readonly horarios = computed<Horario[]>(() => {
    const dataSelecionada = this.selectedDate();
    const ocupados = this.occupiedTimes();
    const agora = new Date();

    const periodos = [
      { inicio: 8 * 60, fim: 12 * 60 },
      { inicio: 14 * 60, fim: 18 * 60 },
    ];

    return periodos.flatMap((periodo) => {
      const slots: Horario[] = [];

      for (let minutos = periodo.inicio; minutos < periodo.fim; minutos += 30) {
        const hora = Math.floor(minutos / 60);
        const minuto = minutos % 60;
        const proximoMinuto = minutos + 30;

        const inicio = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
        const fim = `${String(Math.floor(proximoMinuto / 60)).padStart(2, '0')}:${String(proximoMinuto % 60).padStart(2, '0')}`;

        const horarioPassou =
          dataSelecionada === this.getToday() && new Date(`${dataSelecionada}T${inicio}:00`) <= agora;

        slots.push({
          inicio,
          fim,
          ocupado: ocupados.includes(inicio),
          passado: horarioPassou,
        });
      }

      return slots;
    });
  });

  readonly form = this.fb.nonNullable.group({
    nomePaciente: ['', Validators.required],
    cpfPaciente: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    telefonePaciente: ['', Validators.required],
    dataHora: ['', Validators.required],
    tratamento: ['', Validators.required],
  });

  constructor() {
    addIcons({
      calendarOutline,
      personOutline,
      refreshOutline,
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('dentistaId'));

    if (Number.isInteger(id) && id > 0) {
      this.dentistaId.set(id);
      this.showForm.set(true);
      void this.carregarHorarios();
    }

    void this.loadAgendamentos();
  }

  private getToday(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
  }

  abrirFormulario(): void {
    this.form.reset();
    this.formError.set('');
    this.sucesso.set(false);
    this.dentistaId.set(null);
    this.selectedDate.set(this.getToday());
    this.occupiedTimes.set([]);
    this.availabilityError.set(false);
    this.showForm.set(true);
    void this.carregarHorarios();
  }

  voltarParaLista(): void {
    this.showForm.set(false);
    this.sucesso.set(false);
    this.formError.set('');
  }

  async alterarData(data: string): Promise<void> {
    if (!data) return;

    this.selectedDate.set(data);
    this.form.controls.dataHora.setValue('');
    this.formError.set('');
    await this.carregarHorarios();
  }

  selecionarHorario(horario: string): void {
    this.form.controls.dataHora.setValue(`${this.selectedDate()}T${horario}:00`);
    this.form.controls.dataHora.markAsTouched();
    this.formError.set('');
  }

  async carregarHorarios(): Promise<void> {
    const version = ++this.availabilityVersion;

    this.loadingSlots.set(true);
    this.availabilityError.set(false);
    this.occupiedTimes.set([]);

    try {
      const ocupados = await this.service.horariosOcupados(this.selectedDate(), this.dentistaId());

      if (version === this.availabilityVersion && !this.destroyRef.destroyed) {
        this.occupiedTimes.set(ocupados.map((horario) => horario.slice(0, 5)));
      }
    } catch {
      if (version === this.availabilityVersion && !this.destroyRef.destroyed) {
        this.availabilityError.set(true);
      }
    } finally {
      if (version === this.availabilityVersion && !this.destroyRef.destroyed) {
        this.loadingSlots.set(false);
      }
    }
  }

  async salvarAgendamento(): Promise<void> {
    this.formError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.getRawValue();

    if (new Date(dados.dataHora) <= new Date()) {
      this.formError.set('Escolha uma data e horário futuros.');
      return;
    }

    this.enviando.set(true);

    try {
      await this.service.criar({
        ...dados,
        cpfPaciente: dados.cpfPaciente.replace(/\D/g, ''),
        dentistaId: this.dentistaId(),
      });

      this.sucesso.set(true);
      await this.loadAgendamentos();
    } catch {
      this.formError.set(
        'Não foi possível realizar o agendamento. O horário pode ter sido reservado por outra pessoa. Escolha outro e tente novamente.',
      );
      await this.carregarHorarios();
    } finally {
      this.enviando.set(false);
    }
  }

  async loadAgendamentos(): Promise<void> {
    const version = ++this.requestVersion;
    this.loading.set(true);
    this.error.set(false);

    try {
      const data = await this.service.listar();

      if (version === this.requestVersion && !this.destroyRef.destroyed) {
        this.agendamentos.set(data);
      }
    } catch {
      if (version === this.requestVersion && !this.destroyRef.destroyed) {
        this.error.set(true);
      }
    } finally {
      if (version === this.requestVersion && !this.destroyRef.destroyed) {
        this.loading.set(false);
      }
    }
  }
}
