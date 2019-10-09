import { Component, Input} from '@angular/core';
import * as _ from 'lodash';
import { LayoutComponent } from "../../../shared/layout";
import { Router } from "@angular/router";
import { LocalStorageService } from "../../services";

@Component({
  selector: 'app-toaster',
  template: `
    <div class="toast" [class.show]="show">
      <div class="img">
        <img src="/assets/icons/icon-72x72.png" />
      </div>
      <div class="desc">
        Nova versão disponivel!!
        <br/>
        Clique para atualizar.
        <br/>
        <button (click)="reload()">Atualizar</button>
      </div>
    </div>
  `,
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent {

  @Input() show = false;

  constructor(
    private sync: LayoutComponent,
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  reload() {
    let synchronized = JSON.parse(localStorage['synchronized']);

    if (!synchronized) {
      this.sync.synchronizeProtocols();
    }

    this.router.navigate(['/sair'])
      .catch(reason => {
        console.warn(reason);
      });
    document.location.reload();
  }

}
