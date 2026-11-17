import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface HelpQuestion {
  questionKey: string;
  answerKey: string;
}

interface HelpGuideStep {
  titleKey: string;
  descriptionKey: string;
}

interface HelpGuide {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  route: string;
  actionKey: string;
  steps: readonly HelpGuideStep[];
}

interface HelpTopic {
  titleKey: string;
  questions: readonly HelpQuestion[];
}

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.css'
})
export class AyudaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  busqueda = '';
  guiaSeleccionada: HelpGuide | null = null;
  pasoActual = 0;

  readonly guias: readonly HelpGuide[] = [
    {
      id: 'registration',
      titleKey: 'HELP.GUIDES.REGISTRATION.TITLE',
      descriptionKey: 'HELP.GUIDES.REGISTRATION.DESCRIPTION',
      icon: 'bi-person-plus',
      route: '/registro',
      actionKey: 'HELP.GUIDES.REGISTRATION.ACTION',
      steps: [
        { titleKey: 'HELP.GUIDES.REGISTRATION.STEPS.1.TITLE', descriptionKey: 'HELP.GUIDES.REGISTRATION.STEPS.1.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.REGISTRATION.STEPS.2.TITLE', descriptionKey: 'HELP.GUIDES.REGISTRATION.STEPS.2.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.REGISTRATION.STEPS.3.TITLE', descriptionKey: 'HELP.GUIDES.REGISTRATION.STEPS.3.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.REGISTRATION.STEPS.4.TITLE', descriptionKey: 'HELP.GUIDES.REGISTRATION.STEPS.4.DESCRIPTION' }
      ]
    },
    {
      id: 'login',
      titleKey: 'HELP.GUIDES.LOGIN.TITLE',
      descriptionKey: 'HELP.GUIDES.LOGIN.DESCRIPTION',
      icon: 'bi-box-arrow-in-right',
      route: '/',
      actionKey: 'HELP.GUIDES.LOGIN.ACTION',
      steps: [
        { titleKey: 'HELP.GUIDES.LOGIN.STEPS.1.TITLE', descriptionKey: 'HELP.GUIDES.LOGIN.STEPS.1.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.LOGIN.STEPS.2.TITLE', descriptionKey: 'HELP.GUIDES.LOGIN.STEPS.2.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.LOGIN.STEPS.3.TITLE', descriptionKey: 'HELP.GUIDES.LOGIN.STEPS.3.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.LOGIN.STEPS.4.TITLE', descriptionKey: 'HELP.GUIDES.LOGIN.STEPS.4.DESCRIPTION' }
      ]
    },
    {
      id: 'enrollment',
      titleKey: 'HELP.GUIDES.ENROLLMENT.TITLE',
      descriptionKey: 'HELP.GUIDES.ENROLLMENT.DESCRIPTION',
      icon: 'bi-calendar-check',
      route: '/horario',
      actionKey: 'HELP.GUIDES.ENROLLMENT.ACTION',
      steps: [
        { titleKey: 'HELP.GUIDES.ENROLLMENT.STEPS.1.TITLE', descriptionKey: 'HELP.GUIDES.ENROLLMENT.STEPS.1.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.ENROLLMENT.STEPS.2.TITLE', descriptionKey: 'HELP.GUIDES.ENROLLMENT.STEPS.2.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.ENROLLMENT.STEPS.3.TITLE', descriptionKey: 'HELP.GUIDES.ENROLLMENT.STEPS.3.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.ENROLLMENT.STEPS.4.TITLE', descriptionKey: 'HELP.GUIDES.ENROLLMENT.STEPS.4.DESCRIPTION' }
      ]
    },
    {
      id: 'monthly-payment',
      titleKey: 'HELP.GUIDES.PAYMENT.TITLE',
      descriptionKey: 'HELP.GUIDES.PAYMENT.DESCRIPTION',
      icon: 'bi-credit-card',
      route: '/facturacion',
      actionKey: 'HELP.GUIDES.PAYMENT.ACTION',
      steps: [
        { titleKey: 'HELP.GUIDES.PAYMENT.STEPS.1.TITLE', descriptionKey: 'HELP.GUIDES.PAYMENT.STEPS.1.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.PAYMENT.STEPS.2.TITLE', descriptionKey: 'HELP.GUIDES.PAYMENT.STEPS.2.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.PAYMENT.STEPS.3.TITLE', descriptionKey: 'HELP.GUIDES.PAYMENT.STEPS.3.DESCRIPTION' }
      ]
    },
    {
      id: 'contracts',
      titleKey: 'HELP.GUIDES.CONTRACTS.TITLE',
      descriptionKey: 'HELP.GUIDES.CONTRACTS.DESCRIPTION',
      icon: 'bi-file-earmark-text',
      route: '/contrato',
      actionKey: 'HELP.GUIDES.CONTRACTS.ACTION',
      steps: [
        { titleKey: 'HELP.GUIDES.CONTRACTS.STEPS.1.TITLE', descriptionKey: 'HELP.GUIDES.CONTRACTS.STEPS.1.DESCRIPTION' },
        { titleKey: 'HELP.GUIDES.CONTRACTS.STEPS.2.TITLE', descriptionKey: 'HELP.GUIDES.CONTRACTS.STEPS.2.DESCRIPTION' }
      ]
    }
  ];

  readonly temas: readonly HelpTopic[] = [
    {
      titleKey: 'HELP.TOPICS.ACCOUNT',
      questions: [
        { questionKey: 'HELP.QUESTIONS.CREATE_ACCOUNT', answerKey: 'HELP.ANSWERS.CREATE_ACCOUNT' },
        { questionKey: 'HELP.QUESTIONS.LOGIN', answerKey: 'HELP.ANSWERS.LOGIN' }
      ]
    },
    {
      titleKey: 'HELP.TOPICS.SCHEDULES',
      questions: [
        { questionKey: 'HELP.QUESTIONS.FIND_SCHEDULE', answerKey: 'HELP.ANSWERS.FIND_SCHEDULE' },
        { questionKey: 'HELP.QUESTIONS.ENROLL', answerKey: 'HELP.ANSWERS.ENROLL' }
      ]
    },
    {
      titleKey: 'HELP.TOPICS.PAYMENTS',
      questions: [
        { questionKey: 'HELP.QUESTIONS.PAY_ENROLLMENT', answerKey: 'HELP.ANSWERS.PAY_ENROLLMENT' },
        { questionKey: 'HELP.QUESTIONS.MONTHLY_PAYMENT', answerKey: 'HELP.ANSWERS.MONTHLY_PAYMENT' }
      ]
    },
    {
      titleKey: 'HELP.TOPICS.CONTRACTS',
      questions: [
        { questionKey: 'HELP.QUESTIONS.CONTRACT_STATUS', answerKey: 'HELP.ANSWERS.CONTRACT_STATUS' }
      ]
    }
  ];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const guideId = params.get('guia');
      const guide = this.guias.find((item) => item.id === guideId);
      if (guide) {
        this.iniciarGuia(guide);
      }
    });
  }

  get guiasFiltradas(): HelpGuide[] {
    const termino = this.busqueda.trim().toLocaleLowerCase();
    return this.guias.filter((guia) =>
      [guia.titleKey, guia.descriptionKey, ...guia.steps.flatMap((paso) => [paso.titleKey, paso.descriptionKey])]
        .some((key) => this.translate.instant(key).toLocaleLowerCase().includes(termino))
    );
  }

  get temasFiltrados(): HelpTopic[] {
    const termino = this.busqueda.trim().toLocaleLowerCase();

    return this.temas
      .map((tema) => ({
        ...tema,
        questions: tema.questions.filter((pregunta) =>
          [tema.titleKey, pregunta.questionKey, pregunta.answerKey]
            .some((key) => this.translate.instant(key).toLocaleLowerCase().includes(termino))
        )
      }))
      .filter((tema) => tema.questions.length > 0);
  }

  get pasoGuiaActual(): HelpGuideStep | null {
    return this.guiaSeleccionada?.steps[this.pasoActual] ?? null;
  }

  get progresoGuia(): number {
    return this.guiaSeleccionada
      ? ((this.pasoActual + 1) / this.guiaSeleccionada.steps.length) * 100
      : 0;
  }

  iniciarGuia(guia: HelpGuide): void {
    this.guiaSeleccionada = guia;
    this.pasoActual = 0;
  }

  volverAGuias(): void {
    this.guiaSeleccionada = null;
    this.pasoActual = 0;
  }

  pasoAnterior(): void {
    this.pasoActual = Math.max(0, this.pasoActual - 1);
  }

  siguientePaso(): void {
    if (this.guiaSeleccionada) {
      this.pasoActual = Math.min(this.guiaSeleccionada.steps.length - 1, this.pasoActual + 1);
    }
  }

  actualizarBusqueda(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.busqueda = input.value;
    }
  }
}
