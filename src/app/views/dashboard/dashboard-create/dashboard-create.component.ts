import {AfterViewInit, OnInit, Component} from '@angular/core';
import EditData = DashboardModel.EditData;
import {debounceTime} from 'rxjs/operators';
import {DashboardCreateService} from './dashboard-create.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import {DashboardReviewComponent} from '../dashboard-review/dashboard-review.component';
import {MatDialog} from '@angular/material';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'dashboard-create',
    templateUrl: './dashboard-create.component.html',
    styleUrls: ['./dashboard-create.component.scss'],
})
export class DashboardCreateComponent implements OnInit, AfterViewInit {
    //  \/c olocar as UC aqui
    useruc: any;
    CurricularUnit: any;
    Course: any;
    user = JSON.parse(localStorage['user']);
    user_id = this.user[0].id;
    editcolumns: string[] = ['statement', 'situation' 'action'];
    difficultyDataSource: DashboardModel.Difficulty[] = [];
    ucDataSource: DashboardModel.Uc[] = [];
    courseDataSource: DashboardModel.Course[] = [];
    questionDataSource: DashboardModel.Question[] = [];
    editDataSource: DashboardModel.Question[] = [];

    questionFormGroup: FormGroup;

    constructor(
        private createService: DashboardCreateService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.loadDifficulty();
        this.loadUc();
        this.loadCourse();
        this.loadQuestions();

        this.questionFormGroup = this.formBuilder.group({
            enunciado: ['',
                Validators.required
            ],
            comando: ['',
                Validators.required
            ],
            suporte: ['',
                Validators.required
            ],
            dificuldade: ['',
                Validators.required
            ],
            uc: ['',
                Validators.required
            ],
            curso: ['',
                Validators.required
            ],
            alCorreta: ['',
                Validators.required
            ],
            alIncorreta1: ['',
                Validators.required
            ],
            alIncorreta2: ['',
                Validators.required
            ],
            alIncorreta3: ['',
                Validators.required
            ],
            alIncorreta4: ['',
                Validators.required
            ]
        });
    }

    ngAfterViewInit() {
    }

    openReview(question): void {
        const dialogRef = this.dialog.open(DashboardReviewComponent,
            {
                panelClass: 'dialog',
                maxWidth: '100vw',
                maxHeight: '100vh',
                data: {
                    question,
                    save: 'Salvar',
                    close: 'Cancelar'
                }
            }
        );

        dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    const active = {
                        'idQuestao': question.idQuestao,
                        'idUsuario': question.usuario.id,
                        'idUc': question.unidadeCurricular.id,
                        'idDificuldade': question.dificuldade.idDificuldade,
                        'enunciado': question.enunciado,
                        'comando': question.comando,
                        'suporte': question.suporte,
                        'ativo': 0,
                    };
                    console.log(active);
                    console.log(question);

                    this.createService.saveQuestionUrl();
                    this.createService.create(active)
                        .pipe(debounceTime(300))
                        .subscribe(
                            (resp) => {
                                Swal.fire('Sucesso!', 'Questão atualizada!', 'success');
                                window.location.reload();
                            },
                            error => {
                                Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                                console.warn(error.toString());
                            }
                        );
                }
            });
    }

    onSubmit() {

        const question = {
            'idUsuario': this.user_id,
            'idUc': this.questionFormGroup.get('uc').value,
            'idDificuldade': this.questionFormGroup.get('dificuldade').value,
            'enunciado': this.questionFormGroup.get('enunciado').value,
            'comando': this.questionFormGroup.get('comando').value,
            'suporte': this.questionFormGroup.get('suporte').value,
            'ativo': 0,
        };
        this.createService.prepareQuestionUrl();
        this.createService.create(question)
            .pipe(debounceTime(300))
            .subscribe(
                (resp) => {
                    this.questionDataSource = resp.data;
                    for (let i = 1; i <= 4; i++) {
                        const alternativasInc = {
                            'correta': 0,
                            'alternativa': this.questionFormGroup.get('alIncorreta' + i).value,
                            'idQuestao': resp.idQuestao,
                        };
                        this.createService.prepareAlternativesUrl();
                        this.createService.create(alternativasInc)
                            .pipe(debounceTime(300))
                            .subscribe(
                                (resps) => {
                                    this.questionDataSource = resps.data;
                                },
                                error => {
                                    Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                                    console.warn(error.toString());
                                }
                            );
                    }
                    const alternativasCorr = {
                        'correta': 1,
                        'alternativa': this.questionFormGroup.get('alCorreta').value,
                        'idQuestao': resp.idQuestao,
                    };
                    this.createService.prepareAlternativesUrl();
                    this.createService.create(alternativasCorr)
                        .pipe(debounceTime(300))
                        .subscribe(
                            (resps) => {
                                this.questionDataSource = resps.data;
                            },
                            error => {
                                Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                                console.warn(error.toString());
                            }
                        );
                    Swal.fire('Oba!', 'Questão Criada!', 'success');
                    this.loadQuestions();
                },
                error => {
                    Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                    console.warn(error.toString());
                }
            );
        return;
    }

    private loadDifficulty(): void {
        this.createService.prepareDifficultyUrl();
        this.createService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    this.difficultyDataSource = response;
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }

    private loadUc(): void {
        this.createService.prepareUcUrl();
        this.createService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    this.ucDataSource = response;
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }

    private loadCourse(): void {
        this.createService.prepareCourseUrl();
        this.createService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    this.courseDataSource = response;
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }

    private loadQuestions() {
        this.createService.prepareAllQuestionsUrl();
        this.createService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    let potocolo = [];
                    const user = JSON.parse(localStorage['user']);
                    const user_id = user[0].id;
                    response.forEach(function (resp) {
                        if (resp.usuario.idUsuario === user_id) {
                            if (resp.)
                            potocolo.push(resp);
                        }
                    });
                    this.editDataSource = potocolo;
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }
}
