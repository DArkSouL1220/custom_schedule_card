import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import moment from 'https://cdn.skypack.dev/moment';

class CustomScheduleCard extends LitElement {
  static get properties() {
    return {
      config: { type: Object }
    };
  }

  static get styles() {
    return css`
      :host { display: block; font-family: var(--paper-font-body1_-_font-family); }
      .day { margin-bottom: 8px; }
      .day-title { font-weight: bold; margin-bottom: 4px; }
      .bar {
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        height: 24px;
        position: relative;
        background: var(--divider-color);
      }
      .segment {
        position: absolute;
        top: 0; bottom: 0;
        border-right: 1px solid white;
      }
      .segment span {
        position: absolute;
        top: -18px;
        font-size: 0.75em;
        white-space: nowrap;
      }
    `;
  }

  setConfig(config) {
    // Default-Werte
    this.config = {
      days: ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'],
      schedule: {},
      ...config
    };
  }

  render() {
    return html`
      ${this.config.days.map(day => html`
        <div class="day">
          <div class="day-title">${day}</div>
          <div class="bar">
            ${ (this.config.schedule[day]||[]).map(seg => {
              const fromH = moment(seg.from, 'HH:mm').hour();
              const toH   = moment(seg.to,   'HH:mm').hour();
              const width = (toH - fromH) * (100/24);
              const left  = fromH * (100/24);
              return html`
                <div class="segment" style="
                    left: ${left}%;
                    width: ${width}%;
                    background: ${seg.color};
                  ">
                  <span style="left: 2px;">${seg.value}°C</span>
                </div>
              `;
            })}
          </div>
        </div>
      `)}
    `;
  }
}

customElements.define('custom-schedule-card', CustomScheduleCard);