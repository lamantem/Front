import { AfterViewInit, OnInit, Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material';
import {DashboardReviewComponent} from '../dashboard-review/dashboard-review.component';
import RateData = DashboardModel.RateData;

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
  ratedataSource: DashboardModel.RateData[] = Rate_DATA;
  ratecolumns: string[] = ['uc', 'situation', 'complaint', 'review'];
  private dialog: MatDialog;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
    ) {
    }

  ngOnInit() {

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
}
