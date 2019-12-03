import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/authentication';
import { navItems } from '../../_nav';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {
  navItems = navItems;
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    for (let i = 0; i <= 4; i++) {
      this.navItems[i].attributes = { };
    }
    this.authService.localStorageClear();
    this.router.navigate(['/acesso'])
      .catch(reason => {
        console.warn(reason);
      });
  }

}
