import { Component, Input} from '@angular/core';

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

  reload() {
    document.location.reload();
  }

}
