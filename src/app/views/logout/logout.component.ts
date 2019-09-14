import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/authentication';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.localStorageClear();
    this.router.navigate(['/acesso'])
      .catch(reason => {
        console.warn(reason);
      });
  }

}
