import { AfterViewInit, OnInit, Component } from '@angular/core';
import EditData = DashboardModel.EditData;
import {debounceTime} from 'rxjs/operators';
import {DashboardCreateService} from './dashboard-create.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

const Edit_DATA: EditData[] = [
  {user_id: '1' , question_id: '2' , statement: 'qUESTÃO ddddddddddddddddddddddddddddddddddddddddddddddddddddddd sdsd asd asd asdasdadsdsa dada djdiaosjdoia jsdoia sjdoias jdoaisdj oasidj aosidj aosidj aodij odiajsd osi1 OPA', situation: 'Em aberto', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'OUTRA QUESTATOASO', situation: 'Em aberto', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'ASDASD', situation: 'Em aberto', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'A12321ASSD', situation: 'Em avaliação', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'OOOOOASD', situation: 'Em avaliação', action: 'Editar'},
];

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
  editdataSource: DashboardModel.EditData[] = Edit_DATA;
  editcolumns: string[] = ['statement', 'situation', 'action'];
  difficultyDataSource: DashboardModel.Difficulty[] = [];
  ucDataSource: DashboardModel.Uc[] = [];
  courseDataSource: DashboardModel.Course[] = [];
  questionDataSource: DashboardModel.Question[] = [];

  questionFormGroup: FormGroup;

  constructor(
      private createService: DashboardCreateService,
      private formBuilder: FormBuilder,
    ) {}

  ngOnInit() {
    this.loadDifficulty();
    this.loadUc();
    this.loadCourse();

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
    console.log(question);
    this.createService.prepareQuestionUrl();
    this.createService.create(question)
        .pipe(debounceTime(300))
        .subscribe(
            (resp) => {
              console.log(resp.idQuestao);
              this.questionDataSource = resp.data;


              for (let i = 1 ; i <= 4 ; i++) {
                const alternativasInc = {
                  'correta': 0,
                  'alternativa': this.questionFormGroup.get('alIncorreta' + i).value,
                  'idQuestao': resp.idQuestao,
                };
                console.log(alternativasInc);
                this.createService.prepareAlternativesUrl();
                this.createService.create(alternativasInc)
                    .pipe(debounceTime(300))
                    .subscribe(
                        (resps) => {
                          console.log('parece que deu certo');
                          this.questionDataSource = resps.data;
                        },
                        error => {
                          Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                          console.warn(error.toString())
                        }
                    );
              }
                const alternativasCorr = {
                  'correta': 1,
                  'alternativa': this.questionFormGroup.get('alCorreta').value,
                  'idQuestao': resp.idQuestao,
                };
                console.log(alternativasCorr);
                this.createService.prepareAlternativesUrl();
                this.createService.create(alternativasCorr)
                    .pipe(debounceTime(300))
                    .subscribe(
                        (resps) => {
                          console.log('parece que deu certo');
                          this.questionDataSource = resps.data;
                        },
                        error => {
                          Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                          console.warn(error.toString())
                        }
                    );

              console.log(FormData);
              return;
           },
            error => {
            Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
            console.warn(error.toString())
            }
        );

    console.log(FormData);
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

}
