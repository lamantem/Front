import { AfterViewInit, OnInit, Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material';
import {DashboardReviewComponent} from '../dashboard-review/dashboard-review.component';
import RateData = DashboardModel.RateData;
import {debounceTime} from 'rxjs/operators';
import {DashboardRateService} from './dashboard-rate.service';

const Rate_DATA: RateData[] = [
    {uc: 'Curso de fazer cursos', user_id: '1', question_id: '2', situation: 'opapea', complaint: 'asdasdsad', review: 'dad'},
    {uc: 'Curso de fazer cursos', user_id: '1', question_id: '2', situation: 'opapea', complaint: 'asdasdsad', review: 'dad'},
    {uc: 'Curso de fazer cursos', user_id: '1', question_id: '2', situation: 'opapea', complaint: 'asdasdsad', review: 'dad'},
    {uc: 'Curso de fazer cursos', user_id: '1', question_id: '2', situation: 'opapea', complaint: 'asdasdsad', review: 'dad'},
    {uc: 'Curso de fazer cursos', user_id: '1', question_id: '2', situation: 'opapea', complaint: 'asdasdsad', review: 'dad'},
];

@Component({
  selector: 'dashboard-rate',
  templateUrl: './dashboard-rate.component.html',
  styleUrls: ['./dashboard-rate.component.scss'],
})
export class DashboardRateComponent implements OnInit, AfterViewInit {
    private dialog: MatDialog;
    ratedataSource: DashboardModel.RateData[] = Rate_DATA;
    ratecolumns: string[] = ['uc', 'situation', 'complaint', 'review'];

  questiondataSource: DashboardModel.Question[] = [];
  alternativedataSource: DashboardModel.Alternative[] = [];
  complaintdataSource: DashboardModel.Complaint[] = [];

  constructor(
      private rateService: DashboardRateService,
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

  openReview(): void {
    const dialogRef = this.dialog.open(DashboardReviewComponent,
        {
          disableClose: true,
          panelClass: 'dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            question_id: this.route.snapshot.paramMap.get('question_id')
          }
        }
    );

    dialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.router.navigate(['/'])
                .catch(reason => {
                  console.warn(reason);
                });
          }
        });
  }

    openComplaint() {
        // método de abrir qual foi a reclamação feita se não quiser fazer no modal junto
    }

    private loadQuestion(): void {
        this.rateService.prepareQuestionUrl();
        this.rateService.getAll()
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
