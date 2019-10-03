import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    public sw: SwUpdate
  ) {
    sw.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    sw.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
    sw.available.subscribe(event => {
      sw.activateUpdate().then(() => this.reloadApp());
    });
  }

  ngOnInit() {
    this.router.events.subscribe(
      (evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy() : void {}

  reloadApp(){
    document.location.reload();
    console.log("The app is updating right now");
  }

}
