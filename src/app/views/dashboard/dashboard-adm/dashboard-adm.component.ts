import { AfterViewInit, OnInit, Component } from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {DashboardAdmService} from './dashboard-adm.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from "sweetalert2";

@Component({
  selector: 'dashboard-adm',
  templateUrl: './dashboard-adm.component.html',
  styleUrls: ['./dashboard-adm.component.scss'],
})
export class DashboardAdmComponent implements OnInit, AfterViewInit {
  createuser_email: any;
  createuser_password: any;
  createuser_type: any;
  typeDataSource: DashboardModel.Type[] = [];
  private user: any;
  private id: any;
    userFormGroup: FormGroup;
  constructor(
      private admService: DashboardAdmService,
      private formBuilder: FormBuilder,
  ) {
    }

  ngOnInit() {
    this.loadType();

      this.userFormGroup = this.formBuilder.group({
          email: ['',
              Validators.required
          ],
          senha: ['',
              Validators.required
          ],
          nome: ['',
              Validators.required
          ],
          matricula: ['',
          ],
          afiliacao: ['',
          ],
          cargo: ['',
              Validators.required
          ]
      });
  }

  ngAfterViewInit() {
  }

  createuser() {
      const perfil = {
       'nome': this.userFormGroup.get('nome').value,
       'matricula': this.userFormGroup.get('matricula').value,
       'afiliacao': this.userFormGroup.get('afiliacao').value,
       'cargo': this.userFormGroup.get('cargo').value,
      };
      this.admService.prepareProfilelUrl();
      this.admService.create(perfil)
          .pipe(debounceTime(300))
          .subscribe(
              (resp) => {
                  console.log(resp);
                  const usuario = {
                      'email': this.userFormGroup.get('email').value,
                      'senha': this.userFormGroup.get('senha').value,
                      'idPerfil': resp.perfil.idPerfil,
                  };
                  console.log(usuario);
                  this.admService.prepareUserUrl();
                  this.admService.create(usuario)
                      .pipe(debounceTime(300))
                      .subscribe(
                          (resps) => {
                              console.log(resps);
                          },
                          error => {
                              Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                              console.warn(error.toString());
                          }
                      );
              },
              error => {
                  Swal.fire('Ops!', 'Ocorreu um erro!', 'error');
                  console.warn(error.toString());
              }
          );
  }
  private loadType(): void {
    this.admService.prepareTypeUrl();
    this.admService.getAll()
        .pipe(debounceTime(300))
        .subscribe(
            (response) => {
              this.typeDataSource = response;
            },
            error => {
              console.warn(error.toString());
            }
        );
  }
  private getUserById(id): void {
    this.admService.getUserById(id);
    this.admService.getAll()
        .pipe(debounceTime(300))
        .subscribe(
            (response) => {
              this.user = response;
            },
            error => {
              console.warn(error.toString());
            }
        );
  }
}
