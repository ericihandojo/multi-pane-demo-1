import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // BrowserAnimationsModule is needed for Angular Material animations
    { provide: BrowserAnimationsModule, useValue: BrowserAnimationsModule },
  ],
}).catch(err => console.error(err));
