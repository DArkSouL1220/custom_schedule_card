import { LitElement, html, css } from 'https://unpkg.com/lit-element?module';
import { fireEvent } from 'https://unpkg.com/home-assistant-frontend@latest/src/common/dom/fire_event.js';

class CustomScheduleCardEditor extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object
    };
  }

  static get styles() {
    return css`
      .day-block { border: 1px solid var(--divider-color); padding: 8px; margin-bottom: 12px; }
      .segment-row { display: flex; gap: 8px; margin-bottom: 4px; }
      paper-input, paper-time-input { flex: 1; }
      paper-icon-button { --mdc-icon-button-size: 24px; }
    `;
  }

  setConfig(config) {
    this.config = config;
  }

  _valueChanged(ev) {
    const { name, value } = ev.target;
    const [day, key, idx] = name.split('.');
    if (!this.config.schedule) this.config.schedule = {};
    if (!this.config.schedule[day]) this.config.schedule[day] = [];
    this.config.schedule[day][idx][key] = value;
    fireEvent(this, 'config-changed', { config: this.config });
  }

  _addSegment(day) {
    const defaultSeg = { from: '00:00', to: '01:00', value: 17, color: '#ff9800' };
    if (!this.config.schedule) this.config.schedule = {};
    this.config.schedule[day] = [...(this.config.schedule[day]||[]), defaultSeg];
    fireEvent(this, 'config-changed', { config: this.config });
  }

  _removeSegment(day, idx) {
    this.config.schedule[day].splice(idx,1);
    fireEvent(this, 'config-changed', { config: this.config });
  }

  render() {
    const days = this.config.days || ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
    return html`
      <div>
        ${days.map(day => html`
          <div class="day-block">
            <h3>${day}</h3>
            ${(this.config.schedule?.[day]||[]).map((seg, idx) => html`
              <div class="segment-row">
                <paper-time-input
                  name="${day}.from.${idx}"
                  label="von"
                  .value="${seg.from}"
                  @value-changed="${this._valueChanged}"
                ></paper-time-input>
                <paper-time-input
                  name="${day}.to.${idx}"
                  label="bis"
                  .value="${seg.to}"
                  @value-changed="${this._valueChanged}"
                ></paper-time-input>
                <paper-input
                  name="${day}.value.${idx}"
                  label="°C"
                  type="number"
                  .value="${seg.value}"
                  @value-changed="${this._valueChanged}"
                ></paper-input>
                <paper-input
                  name="${day}.color.${idx}"
                  label="Farbe"
                  .value="${seg.color}"
                  @value-changed="${this._valueChanged}"
                ></paper-input>
                <paper-icon-button
                  icon="mdi-delete"
                  @click="${()=>this._removeSegment(day, idx)}"
                ></paper-icon-button>
              </div>
            `)}
            <mwc-button dense @click="${()=>this._addSegment(day)}">+ Segment</mwc-button>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('custom-schedule-card-editor', CustomScheduleCardEditor);

// damit Lovelace den Editor findet:
window.customCards = window.customCards || [];
window.customCards.push({
  type: "custom-schedule-card",
  name: "Custom Schedule Card",
  description: "Erstellt einen Wochen‑Zeitplan mit editierbaren Segmenten",
  preview: true,
  documentationURL: "https://github.com/dein-github/custom_schedule_card"
});