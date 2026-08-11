import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <h1>Remote microfrontend</h1>
    <p>This is a remote microfrontend and here is the exposed button.</p>
    <app-button />
    <p class="hint">
      This standalone page exists only for local development. The host consumes
      <code>./Button</code> through <code>remoteEntry.js</code>.
    </p>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        max-width: 960px;
        margin: 0 auto;
        padding: 2rem;
      }

      .hint {
        color: #888;
      }
    `,
  ],
})
export class AppComponent {}
