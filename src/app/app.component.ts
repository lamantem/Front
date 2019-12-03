import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { CheckForUpdateService } from './core/service-worker/check-for-update.service';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  updateAvailable = false;

  constructor(private updates: SwUpdate,
              public checkForUpdateService: CheckForUpdateService,
              private router: Router) {
    this.updates.available.subscribe((event) => {
      this.updateAvailable = true;
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

  ngOnDestroy(): void {}

}
