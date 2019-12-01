import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private location: Location,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(): boolean {
    console.log(this.authenticationService.isAuthenticated());
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    if (this.location.path() === '/leitura')  {
      return true;
    }

    console.log('Not authenticated, redirecting...');

    if (this.location.path() === '' || this.location.path() === '/')  {
      this.router.navigate(['/acesso'], {
        replaceUrl: true
      });
    }

    return false;
  }
}
