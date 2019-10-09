import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { AuthenticationService } from "../../core/authentication";
import { LocalStorageService } from "../../core/services";
import { LayoutService } from "./layout.service";
import { DashboardListService } from "../../views/dashboard/dashboard-list/dashboard-list.service";
import { navItems } from '../../_nav';

import * as _ from 'lodash';
import Swal from "sweetalert2";

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
  loading: boolean;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private layoutService: LayoutService,
    private dashboardListService: DashboardListService,
    @Inject(DOCUMENT) _document?: any,
    @Inject(AuthenticationService) _auth? : any,
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

  userName() : any {
    if (!this.user) {
      this.user = this.auth.getCurrentUser();
    }
    return (this.user) ? this.user.name : '';
  }

  synchronizeProtocols() {
    this.loading = true;
    if (!navigator.onLine) {
      this.loading = false;
      Swal.fire('Ops!', 'Você precisa conectar a internet!', 'error');
      return;
    }

    if (this.isSynchronized()) {
      this.loading = false;
      Swal.fire('Ops!', 'No momento não existe registro para sincronizar!', 'warning');
      return;
    }

    let protocols = this.loadProtocols();

    if (_.isEmpty(protocols)) {
      this.synchronized = true;
      this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
    }

    if (!_.isEmpty(protocols)) {
      let remove = _.remove(protocols, {'active': 0});

      if (!_.isEmpty(remove)) {
        this.layoutService.deleteSyncProtocolUrl();
        this.layoutService.deleteAllWithToken(remove)
          .subscribe((resp) => {
            if (resp.status === 202) {
              let protocols_local = [];
              protocols = this.loadProtocols();
              protocols.forEach(function (protocol) {
                if (protocol.id !== remove[0].id) {
                  protocols_local.push(protocol);
                }
              });

              this.synchronized = true;
              this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));

              this.localStorage.clearItem('protocols');
              this.localStorage.setItem('protocols', JSON.stringify(protocols_local));
              return;
            }
          },
          error => {
            this.loading = false;
            Swal.fire('Ops!', 'Ocorreu um erro, tente novamente!', 'error');
          });
      }

      if (!_.isEmpty(protocols)) {
        this.layoutService.prepareSyncProtocolUrl();
        this.layoutService.createWithToken(protocols)
          .subscribe((resp) => {
            if (resp.status === 201) {
              this.dashboardListService.getGroupReaderUrl();
              this.dashboardListService.getAll()
                .pipe(debounceTime(300))
                .subscribe((response) => {
                    if (response.status === 200) {
                      let protocols_local = [];
                      response.data.forEach(function (group) {
                        group.protocols.forEach(function (protocol) {
                          protocols_local.push({
                            id: protocol.id,
                            date_reader: protocol.date_reader,
                            group_reader_id: protocol.group_reader_id,
                            moderator_id: protocol.moderator_id,
                            participant_id: protocol.participant_id,
                            participant_name: protocol.participant_name,
                            protocol_type: protocol.protocol_type,
                            registration_code: protocol.registration_code,
                            period: protocol.period,
                            active: 1,
                            sync: 1
                          });
                        });
                      });

                      if (protocols_local.length > 0) {
                        this.localStorage.clearItem('protocols');
                        this.localStorage.setItem('protocols', JSON.stringify(protocols_local));
                      }

                      this.loading = false;

                      this.synchronized = true;
                      this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));

                      Swal.fire('Bom trabalho!', 'Registros sincronizados com sucesso!', 'success')
                        .then((result) => {
                          if (result.value) {
                            this.router.navigate(['/'])
                              .catch(reason => {
                                console.warn(reason);
                              });
                          }
                        });
                    }
                  },
                  error => {
                    this.loading = false;
                    Swal.fire('Ops!', 'Ocorreu um erro, tente novamente!', 'error');
                    return;
                  });
            }
          });

      }
      if (_.isEmpty(protocols)) {
          this.loading = false;

          this.synchronized = true;
          this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));

          Swal.fire('Bom trabalho!', 'Registros sincronizados com sucesso!', 'success')
              .then((result) => {
                  if (result.value) {
                      this.router.navigate(['/'])
                          .catch(reason => {
                              console.warn(reason);
                          });
                  }
              });
      }
    }
  }

  cleanProtocols() {
      Swal.fire({
          title: 'Deseja limpar os faltantes?',
          text: "Você perderá todos que não foram sincronizados",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, pretendo limpar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.value) {
              this.localStorage.setItem('protocols', JSON.stringify([]));
              this.router.navigate(['/'])
                  .catch(reason => {
                      console.warn(reason);
                  });
              this.synchronized = true;
              this.localStorage.setItem('synchronized', JSON.stringify(this.synchronized));
              Swal.fire(
                  'Deletado!',
                  'Faltantes removidos.',
                  'success'
              )
          }
      })
  }

  verifySynchronized(): void {
    if (!this.isSynchronized()) {
      Swal.fire('Ops!', 'Você precisa sincronizar antes de sair!', 'error');
      return;
    }

    this.router.navigate(['/sair'])
      .catch(reason => {
        console.warn(reason);
      });
  }

  isSynchronized() : boolean {
    return JSON.parse(localStorage['synchronized']);
  }

  loadProtocols() : any {
    return JSON.parse(localStorage['protocols']);
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

}
