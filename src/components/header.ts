import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/button/button.js';
@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = '';

  @property({ type: Boolean }) enableBack: boolean = false;

  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--app-color-primary, black);
      color: white;
      padding: 12px;
      padding-top: 4px;

      position: fixed;
      left: env(titlebar-area-x, 0);
      top: env(titlebar-area-y, 0);
      height: env(titlebar-area-height, 60px);
      width: env(titlebar-area-width, calc(100% - 36px));
      -webkit-app-region: drag;
    }

    header h1 {
      margin-top: 0;
      margin-bottom: 0;
      font-size: 12px;
      font-weight: bold;
    }

    nav a {
      margin-left: 10px;
    }

    #back-button-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    #logo-block {
      width: 99px;
      height: 56px;
      background-image: url('/assets/images/the-mount-logo-dark.png');
      background-size: contain;
      background-repeat: no-repeat;
    }

    @media (prefers-color-scheme: light) {
      header {
        color: black;
        background: var(--app-color-primary, white);
      }

      #logo-block {
        background-image: url('/assets/images/the-mount-logo-light.png');
      }

      nav a {
        color: initial;
      }
    }
  `;

  render() {
    return html`
      <header>
        <div id="logo-block">&nbsp;</div>
        <div id="back-button-block">
          ${this.enableBack
            ? html`<sl-button size="small" href="${resolveRouterPath()}">
                Back
              </sl-button>`
            : null}

          <h1>${this.title}</h1>
        </div>
      </header>
    `;
  }
}

