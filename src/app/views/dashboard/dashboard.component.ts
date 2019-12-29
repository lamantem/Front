import {AfterViewInit, Component, OnInit} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {DashboardService} from './dashboard.service';
import {LocalStorageService} from '../../core/services';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {navItems} from '../../_nav';

@Component({
  templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
    id: any;
    nome: any;
    cargo: any;




    constructor(
        private dashboardService: DashboardService,
        public localStorage: LocalStorageService,
        private router: Router
    ) {
    }

    ngOnInit() {
        const nome1 = JSON.parse(localStorage['user']);
        const cargo1 = JSON.parse(localStorage['type']);
        this.cargo = cargo1.tipo;
        this.nome = nome1[0].perfil.nome;
    }

    ngAfterViewInit() {
    }


}
