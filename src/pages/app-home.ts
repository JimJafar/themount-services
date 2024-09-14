import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';
import { getServices } from '../utils/content';
import { friendlyDate } from '../utils/date';

@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome to The Mount!';
  @property() services = [];

  static styles = [
    styles,
    css`
      #welcomeBar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      #welcomeCard {
        padding-top: 0px;
      }

      sl-card::part(footer) {
        display: flex;
        justify-content: flex-end;
      }

      @media (horizontal-viewport-segments: 2) {
        #welcomeBar {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        #welcomeCard {
          margin-right: 64px;
        }
      }
    `,
  ];

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    this.services = (await getServices())?.data || [];
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'The Mount St. Helens Services',
        text: 'Check out our new app for worship lyrics and more!',
        url: 'https://themount-services.codeministry.net',
      });
    }
  }

  render() {
    return html`
      <app-header></app-header>

      <main>
        <div id="welcomeBar">
          <sl-card id="welcomeCard">
            <div slot="header">
              <h2>${this.message}</h2>
            </div>

            <p>
              This is where you can find information about our Sunday services,
              including worship lyrics and notices.
            </p>
            <p>We plan to add lots more features soon!</p>

            <h3>Services</h3>
            <ul>
              ${this.services.map(
                (service: any) => html`<li>
                  <a href="${resolveRouterPath(`service/${service.id}`)}"
                    >${friendlyDate(service.attributes.date)}</a
                  >
                </li>`
              )}
            </ul>

            ${'share' in navigator
              ? html`<sl-button
                  slot="footer"
                  variant="default"
                  @click="${this.share}"
                >
                  <sl-icon slot="prefix" name="share"></sl-icon>
                  Share this!
                </sl-button>`
              : null}
          </sl-card>
        </div>
      </main>
    `;
  }
}

