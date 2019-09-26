import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { AuthenticationService } from "../../core/authentication";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { LocalStorageService } from "../../core/services";
import { LayoutService } from "./layout.service";

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
  auth: any;
  synchronized: boolean;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private layoutService: LayoutService,
    @Inject(DOCUMENT) _document?: any,
    @Inject(AuthenticationService) _auth? : any,
  ) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.auth = _auth;
    this.user = this.auth.getCurrentUser();
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  userName() : any {
    if (!this.user) {
      this.user = this.auth.getCurrentUser();
    }
    return (this.user) ? this.user.name : '';
  }

  synchronizeProtocols() {
    if (!navigator.onLine) {
      Swal.fire('Ops!', 'Você precisa conectar a internet!', 'error');
      return;
    }

    let protocols = JSON.parse(localStorage['protocols']);

    this.layoutService.prepareSyncProtocolUrl();
    this.layoutService.createWithToken(protocols).subscribe((resp)=> {
      if (resp == 500) {
        Swal.fire('Ops!', 'Ocorreu um erro, tente novamente!', 'error');
      }
    } );

    this.synchronized = true;
    this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
    Swal.fire('Good job!', 'Sincronizado com sucesso!', 'success');
  }

  isSynchronized(): void {
    let synchronized = JSON.parse(localStorage['synchronized']);

    if (!synchronized) {
      Swal.fire('Ops!', 'Você precisa sincronizar antes de sair!', 'error');
      return;
    }

    this.router.navigate(['/sair'])
      .catch(reason => {
        console.warn(reason);
      });
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
