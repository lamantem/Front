import { AfterViewInit, OnInit, Component } from '@angular/core';
import GenData = DashboardModel.GenData;
import {debounceTime} from 'rxjs/operators';
import {DashboardGenerateService} from './dashboard-generate.service';

const Gen_DATA: GenData[] = [
  {uc: 'Curso de análise', question_id: '2' , statement: 'OOOOsadfasfdas sadf asdf asd sda dfas df asdf asdf asdf asdf asd fas fasdf asf fsdf safs sfdOASD', action: 'Adicionar'},
  {uc: 'Curso de chapeiro', question_id: '2' , statement: 'OOOOsdsdadOASD', action: 'Adicionar'},
  {uc: '1', question_id: '2' , statement: 'asdsadadsadsad', action: 'Adicionar'},
  {uc: 'Curso de fazer cursos', question_id: '2' , statement: 'OOOOOAdsadaSD', action: 'Adicionar'},
];

@Component({
  selector: 'dashboard-generate',
  templateUrl: './dashboard-generate.component.html',
  styleUrls: ['./dashboard-generate.component.scss'],
})
export class DashboardGenerateComponent implements OnInit, AfterViewInit {
  gendataSource: DashboardModel.GenData[] = Gen_DATA;
  gencolumns: string[] = ['statement', 'action'];
  questiondataSource: DashboardModel.Question[] = [];
  alternativedataSource: DashboardModel.Alternative[] = [];
  CurricularUnit: any;
  Course: any;
  Dificuldade: any;
  difficultyDataSource: DashboardModel.Difficulty[] = [];
  ucDataSource: DashboardModel.Uc[] = [];
  courseDataSource: DashboardModel.Course[] = [];
  constructor(
      private generateService: DashboardGenerateService
    ) {
    }

  ngOnInit() {
    this.loadDifficulty();
    this.loadUc();
    this.loadCourse();
    this.loadQuestion();
    this.loadAlternatives();
  }

  ngAfterViewInit() {
  }

  applyFilterSearch(filterValue: string) {
  //   this.gendataSource.filter = filterValue.trim().toLowerCase();
  return;
  }

    onSubmit() {
        return;
    }

  private loadDifficulty(): void {
    this.generateService.prepareDifficultyUrl();
    this.generateService.getAll()
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
    this.generateService.prepareUcUrl();
    this.generateService.getAll()
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
    this.generateService.prepareCourseUrl();
    this.generateService.getAll()
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

  private loadQuestion(): void {
    this.generateService.prepareQuestionUrl();
    this.generateService.getAll()
        .pipe(debounceTime(300))
        .subscribe(
            (response) => {
              this.questiondataSource = response;
            },
            error => {
              console.warn(error.toString());
            }
        );
  }

  private loadAlternatives(): void {
    this.generateService.prepareAlternativesUrl();
    this.generateService.getAll()
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

    add() {
        return;
    }
}
