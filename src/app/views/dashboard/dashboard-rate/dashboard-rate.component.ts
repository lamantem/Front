import {AfterViewInit, OnInit, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {DashboardReviewComponent} from '../dashboard-review/dashboard-review.component';
import RateData = DashboardModel.RateData;
import {debounceTime} from 'rxjs/operators';
import {DashboardRateService} from './dashboard-rate.service';
import Swal from "sweetalert2";

import * as _ from 'lodash';

@Component({
    selector: 'dashboard-rate',
    templateUrl: './dashboard-rate.component.html',
    styleUrls: ['./dashboard-rate.component.scss'],
})
export class DashboardRateComponent implements OnInit, AfterViewInit {
    ratecolumns: string[] = ['enunciado', 'user', 'review'];

    questiondataSource: DashboardModel.Question[] = [];
    alternativedataSource: DashboardModel.Alternative[] = [];
    complaintdataSource: DashboardModel.Complaint[] = [];

    constructor(
        private rateService: DashboardRateService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.loadQuestion();
        this.loadAlternatives();
        this.loadComplaint();
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
                    close: 'Reprovado',
                    save: 'Aprovado'
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
                        'idDificuldade': question.dificuldade.id,
                        'enunciado': question.enunciado,
                        'comando': question.comando,
                        'suporte': question.suporte,
                        'ativo': 1,
                    };

                    this.rateService.saveQuestionUrl();
                    this.rateService.create(active)
                        .pipe(debounceTime(300))
                        .subscribe(
                            (resp) => {
                                Swal.fire('Sucesso!', 'Questão aprovada!', 'success');
                                window.location.reload();
                            },
                            error => {
                                Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                                console.warn(error.toString());
                            }
                        );
                }

                if (!result) {
                    const active = {
                        'idQuestao': question.idQuestao,
                        'idUsuario': question.usuario.id,
                        'idUc': question.unidadeCurricular.id,
                        'idDificuldade': question.dificuldade.id,
                        'enunciado': question.enunciado,
                        'comando': question.comando,
                        'suporte': question.suporte,
                        'ativo': 3,
                    };

                    this.rateService.saveQuestionUrl();
                    this.rateService.create(active)
                        .pipe(debounceTime(300))
                        .subscribe(
                            (resp) => {
                                Swal.fire('', 'Questão reprovada!', 'success');
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


    private loadQuestion(): void {
        this.rateService.prepareQuestionUrl();
        this.rateService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    this.questiondataSource = response;
                    this.questiondataSource = _.filter(this.questiondataSource, {'ativo': 0});
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }

    private loadAlternatives(): void {
        this.rateService.prepareAlternativeUrl();
        this.rateService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    this.alternativedataSource = response;
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }

    private loadComplaint(): void {
        this.rateService.prepareComplaintUrl();
        this.rateService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    this.complaintdataSource = response;
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }
}
