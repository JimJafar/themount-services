import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// You can also import styles from another file
// if you prefer to keep your CSS seperate from your component
import { styles } from './service-styles';

import { styles as sharedStyles } from '../../styles/shared-styles';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import { getService } from '../../utils/content';
import { friendlyDate } from '../../utils/date';

@customElement('app-service')
export class AppService extends LitElement {
  @property({ type: String }) id: string = '';
  @property({ type: Object }) service: any = {};

  static styles = [sharedStyles, styles];

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    const container = this.shadowRoot?.getElementById('worship-songs');

    // Close all other details when one is shown
    container?.addEventListener('sl-show', (event) => {
      if ((event.target as Element)?.localName === 'sl-details') {
        [...container.querySelectorAll('sl-details')].map(
          (details) => (details.open = event.target === details)
        );
        setTimeout(() => {
          (event.target as Element)?.scrollIntoView({
            behavior: 'smooth',
          });
        }, 300);
      }
    });
  }

  async connectedCallback() {
    super.connectedCallback();

    this.service = (await getService(this.id))?.data || {};
  }

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>

      <main>
        <sl-card>
          <div slot="header">
            <h2>Service ${friendlyDate(this.service.attributes?.date)}</h2>
          </div>
          <h3>Worship Songs</h3>

          <div id="worship-songs">
            ${this.service.attributes?.songs?.data?.map(
              (song: any, index: number) => html`
              <sl-details summary="${song.attributes.title}" ${
                index === 0 ? 'open' : ''
              }>
                ${song.attributes.lyrics.map(
                  (block: any) =>
                    html`<p class="lyric-line">
                      ${block.children[0].text || html`<br />`}
                    </p>`
                )}
                <p><i>${song.artist}<i></p>
              </sl-details>
            `
            )}
          </div>
        </sl-card>
      </main>
      <style>
        .worship-songs sl-details:not(:last-of-type) {
          margin-bottom: var(--sl-spacing-2x-small);
        }
        .lyric-line {
          margin: 0 0 7px 0 !important;
        }
      </style>
    `;
  }
}

