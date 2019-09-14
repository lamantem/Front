import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { AuthenticationService } from "../../core/authentication";

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
  constructor(
    @Inject(DOCUMENT) _document?: any,
    @Inject(AuthenticationService) _auth? : any
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

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
