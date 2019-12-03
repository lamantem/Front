import {Component, OnDestroy, Inject, OnInit} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { AuthenticationService } from '../../core/authentication';
import { LocalStorageService } from '../../core/services';
import { LayoutService } from './layout.service';

import { navItems } from '../../_nav';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  preserveWhitespaces: false
})
export class LayoutComponent implements  OnInit, OnDestroy {
  navItems = navItems;
  sidebarMinimized: boolean;
  changes: MutationObserver;
  element: HTMLElement;
  user: any;
  auth: any;
  loading: boolean;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private layoutService: LayoutService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) _document?: any,
    @Inject(AuthenticationService) _auth?: any,
  ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.loading = false;
    this.auth = _auth;
    this.user = this.auth.getCurrentUser();
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit() {
    this.verifyType();
  }

  userName(): any {
    if (!this.user) {
      this.user = this.auth.getCurrentUser();
    }
    return (this.user) ? this.user.name : '';
  }


  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  exit() {
    this.router.navigate(['/sair'])
        .catch(reason => {
          console.warn(reason);
        });
  }

  verifyType() {
    const type = JSON.parse(localStorage['type']);
    if (type.tipo === 'Docente') {
      this.navItems[3].attributes = { hidden: true};
      this.navItems[4].attributes = { hidden: true};
    }
    if (type.tipo === 'Avaliador') {
      this.navItems[1].attributes = { hidden: true};
      this.navItems[2].attributes = { hidden: true};
      this.navItems[4].attributes = { hidden: true};
    }
    if (type.tipo === 'Administrador Root') {
      this.navItems[1].attributes = { hidden: true};
      this.navItems[2].attributes = { hidden: true};
      this.navItems[3].attributes = { hidden: true};
    }
    if (type.tipo === 'Administrador') {
      this.navItems[1].attributes = { hidden: true};
      this.navItems[2].attributes = { hidden: true};
      this.navItems[3].attributes = { hidden: true};
    }
  }
}
