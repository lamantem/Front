import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();

  /**
    * To enable PWA Service worker uncomment this code
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('ngsw-worker.js');
        });
    }
  */


}

platformBrowserDynamic().bootstrapModule(AppModule, {
    preserveWhitespaces: true
})
  .catch(err => console.log(err));
