import { Component, OnDestroy, Inject } from '@angular/core';
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
export class LayoutComponent implements OnDestroy {
  navItems = navItems;
  sidebarMinimized: boolean;
  changes: MutationObserver;
  element: HTMLElement;
  user: any;
  usertype: any;
  auth: any;
  synchronized: boolean;
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
}
