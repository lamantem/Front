import { AfterViewInit, OnInit, Component } from '@angular/core';
import GenData = DashboardModel.GenData;
import {debounceTime} from 'rxjs/operators';
import {DashboardGenerateService} from './dashboard-generate.service';

// @ts-ignore
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
  gencolumns: string[] = ['statement', 'uc', 'action'];
  questiondataSource: DashboardModel.Question[] = [];
  alternativedataSource: DashboardModel.Alternative[] = [];
  CurricularUnit: any;
  Course: any;
  Dificuldade: any;
  constructor(
      private generateService: DashboardGenerateService
    ) {
    }

  ngOnInit() {
    this.loadQuestion();
    this.loadAlternatives();
  }

  ngAfterViewInit() {
  }

  // private getGenData(): void {
  //   let groups = localStorage.getItem('groups');
  //   let group_id = this.route.snapshot.paramMap.get('group_id');
  //   this.groupsReaderDataSource = JSON.parse(groups);
  //   this.groupsReaderDataSource = _.filter(this.groupsReaderDataSource, {'id': parseInt(group_id)});
  //
  //   let participants = [];
  //   this.groupsReaderDataSource.forEach(function (group) {
  //     group.participants.forEach(function (participant) {
  //       let participant_local = {
  //         name:               participant.name,
  //         registration_code:  participant.registration_code,
  //         allocation_code:    participant.allocation_code,
  //         period:             participant.period
  //       };
  //       participants.push(participant_local);
  //     })
  //   });
  //
  //   this.dataSourceSearch = new MatTableDataSource(participants);
  // }

  add() {
    // guardar ou remover question_id de uma lista
    return;
  }

  applyFilterSearch(filterValue: string) {
  //   this.gendataSource.filter = filterValue.trim().toLowerCase();
  return;
  }

    onSubmit() {
        return;
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
}
