import {AfterViewInit, OnInit, Component, Inject} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {DashboardReviewService} from './dashboard-review.service';
import {DashboardRateComponent} from '../dashboard-rate/dashboard-rate.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../core/services';

import * as _ from 'lodash';

@Component({
    selector: 'dashboard-review',
    templateUrl: './dashboard-review.component.html',
    styleUrls: ['./dashboard-review.component.scss'],
})
export class DashboardReviewComponent implements OnInit {
    difficultyDataSource: DashboardModel.Difficulty[] = [];
    ucDataSource: DashboardModel.Uc[] = [];
    courseDataSource: DashboardModel.Course[] = [];
    alternativeDataSource = [];
    correto: any;
    reviewFormGroup: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DashboardRateComponent>,
        private reviewService: DashboardReviewService,
        private formBuilder: FormBuilder,
        private router: Router,
        public localStorage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }

    ngOnInit() {
        this.loadDifficulty();
        this.loadUc();
        this.loadCourse();

        this.reviewFormGroup = this.formBuilder.group({
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

        this.reviewService.prepareAlternativesUrl();
        this.reviewService.getAll()
            .pipe(debounceTime(300))
            .subscribe(
                (response) => {
                    const array = [];
                    let correto;
                    const user = JSON.parse(localStorage['user']);
                    const data = this.data;
                    response.forEach(function(resp) {
                        if (resp.questao.idQuestao === data.question.idQuestao) {
                            if (resp.correta === 1) {
                                correto = resp;
                            } else {
                                array.push(resp.alternativa);
                            }
                        }
                    });
                    this.correto = correto;
                    this.alternativeDataSource = array;

                    this.setValue();
                },
                error => {
                    console.warn(error.toString());
                }
            );
    }

    private loadDifficulty(): void {
        this.reviewService.prepareDifficultyUrl();
        this.reviewService.getAll()
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
        this.reviewService.prepareUcUrl();
        this.reviewService.getAll()
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
        this.reviewService.prepareCourseUrl();
        this.reviewService.getAll()
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

    setValue() {
        this.reviewFormGroup.get('enunciado').setValue(this.data.question.enunciado);
        this.reviewFormGroup.get('comando').setValue(this.data.question.comando);
        this.reviewFormGroup.get('suporte').setValue(this.data.question.suporte);
        this.reviewFormGroup.get('dificuldade').setValue(this.data.question.dificuldade.dificuldade);
        this.reviewFormGroup.get('uc').setValue(this.data.question.unidadeCurricular.nome);
        this.reviewFormGroup.get('curso').setValue(this.data.question.unidadeCurricular.curso.nome);
        this.reviewFormGroup.get('alCorreta').setValue(this.correto.alternativa);
        this.reviewFormGroup.get('alIncorreta1').setValue(this.alternativeDataSource[0]);
        this.reviewFormGroup.get('alIncorreta2').setValue(this.alternativeDataSource[1]);
        this.reviewFormGroup.get('alIncorreta3').setValue(this.alternativeDataSource[2]);
        this.reviewFormGroup.get('alIncorreta4').setValue(this.alternativeDataSource[3]);
    }
}
