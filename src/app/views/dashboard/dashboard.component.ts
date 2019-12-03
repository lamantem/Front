import {AfterViewInit, Component, OnInit} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {DashboardService} from './dashboard.service';
import {LocalStorageService} from '../../core/services';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {navItems} from '../../_nav';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
    id: any;

    constructor(
        private dashboardService: DashboardService,
        public localStorage: LocalStorageService,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }


}
