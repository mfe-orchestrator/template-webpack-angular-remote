import { Component, input, signal } from '@angular/core';

type Variant = 'primary' | 'secondary' | 'danger';

const COLORS: Record<Variant, string> = {
  primary: '#007bff',
  secondary: '#6c757d',
  danger: '#dc3545',
};

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      id="click-btn"
      [disabled]="disabled()"
      [style.background-color]="disabled() ? '#cccccc' : color()"
      [style.opacity]="disabled() ? 0.6 : 1"
      (click)="clicks.set(clicks() + 1)"
    >
      Click me: {{ clicks() }}
    </button>
  `,
  styles: [
    `
      button {
        padding: 10px 20px;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }

      button:disabled {
        cursor: not-allowed;
      }
    `,
  ],
})
export class ButtonComponent {
  readonly variant = input<Variant>('primary');
  readonly disabled = input(false);
  readonly clicks = signal(0);

  color(): string {
    return COLORS[this.variant()] ?? COLORS.primary;
  }
}
