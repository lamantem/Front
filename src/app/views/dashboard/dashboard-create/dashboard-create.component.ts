import { AfterViewInit, OnInit, Component } from '@angular/core';
import EditData = DashboardModel.EditData;

const Edit_DATA: EditData[] = [
  {user_id: '1' , question_id: '2' , statement: 'qUESTÃO ddddddddddddddddddddddddddddddddddddddddddddddddddddddd sdsd asd asd asdasdadsdsa dada djdiaosjdoia jsdoia sjdoias jdoaisdj oasidj aosidj aosidj aodij odiajsd osi1 OPA', situation: 'Em aberto', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'OUTRA QUESTATOASO', situation: 'Em aberto', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'ASDASD', situation: 'Em aberto', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'A12321ASSD', situation: 'Em avaliação', action: 'Editar'},
  {user_id: '1' , question_id: '2' , statement: 'OOOOOASD', situation: 'Em avaliação', action: 'Editar'},
];

@Component({
  selector: 'dashboard-create',
  templateUrl: './dashboard-create.component.html',
  styleUrls: ['./dashboard-create.component.scss'],
})
export class DashboardCreateComponent implements OnInit, AfterViewInit {
  //  \/c olocar as UC aqui
  useruc: any;
  CurricularUnit: any;
  Course: any;
  editdataSource: DashboardModel.EditData[] = Edit_DATA;
  editcolumns: string[] = ['statement', 'situation', 'action'];
  Dificuldade: any;
  constructor(
    ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onSubmit() {
    return;
  }
}
