import { CUSTOM_ELEMENT_NAME_PROPERTY } from '@tylertech/forge-core';
import { html, nothing, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseLitElement } from '../../core/base/base-lit-element.js';
import { IconRegistry } from '../../icon/index.js';
import { tylIconArrowDropDown } from '@tylertech/tyler-icons';

import '../../icon/icon.js';
import '../../icon-button/icon-button.js';
import '../../menu/menu.js';
import '../../state-layer/state-layer.js';

import { ICrumbConfiguration, IBreadcrumbSelectEventData, BREADCRUMB_CONSTANTS } from '../breadcrumb/breadcrumb-constants.js';
import { CRUMB_TAG_NAME } from './crumb-constants.js';
import type { IMenuOption } from '../../menu/menu-constants.js';

import styles from './crumb.scss';

export interface ICrumbComponent {
  crumb: ICrumbConfiguration;
  active: boolean;
}

/**
 * @tag forge-crumb
 * @summary An individual crumb item within a breadcrumb navigation.
 */
@customElement(CRUMB_TAG_NAME)
export class CrumbComponent extends BaseLitElement implements ICrumbComponent {
  static {
    IconRegistry.define([tylIconArrowDropDown]);
  }

  public static styles = unsafeCSS(styles);

  /** @deprecated Used for compatibility with legacy Forge @customElement decorator. */
  public static [CUSTOM_ELEMENT_NAME_PROPERTY] = CRUMB_TAG_NAME;

  @property({ attribute: false })
  public crumb: ICrumbConfiguration = { label: '' };

  @property({ type: Boolean, reflect: true })
  public active = false;

  @property({ type: Number })
  public index = 0;

  @property()
  public separator = '';

  public render(): TemplateResult {
    return html` <div class="forge-crumb">${this.#renderContent()} ${this.#renderSiblingTrigger()} ${this.#renderSeparator()}</div> `;
  }

  #renderContent(): TemplateResult {
    if (this.active || !this.crumb.path) {
      return html`
        <span class="active" aria-current=${this.active ? 'page' : nothing}>
          <span class="label-text">${this.crumb.label}</span>
        </span>
      `;
    }

    return html`
      <button class="link" type="button" @click=${this.#handleClick}>
        <forge-state-layer></forge-state-layer>
        ${this.crumb.icon ? html`<forge-icon class="crumb-icon" .name=${this.crumb.icon}></forge-icon>` : nothing}
        <span class="label-text">${this.crumb.label}</span>
        ${this.crumb.secondary ? html`<span class="secondary-text">${this.crumb.secondary}</span>` : nothing}
      </button>
    `;
  }

  #renderSeparator(): TemplateResult | typeof nothing {
    if (!this.separator || this.active) {
      return nothing;
    }
    return html`<forge-icon class="separator" .name=${this.separator}></forge-icon>`;
  }

  #renderSiblingTrigger(): TemplateResult | typeof nothing {
    if (!this.crumb.siblingRoutes?.length || this.active) {
      return nothing;
    }

    const menuOptions: IMenuOption[] = this.crumb.siblingRoutes.map(route => ({
      label: route.label,
      value: route.path ?? route.label,
      secondaryLabel: route.secondary,
      leadingIcon: route.icon,
      leadingIconType: 'component'
    }));

    return html`
      <forge-menu .options=${menuOptions} @forge-menu-select=${this.#handleSiblingSelect} dense>
        <forge-icon-button class="sibling-trigger" aria-label="Sibling routes">
          <forge-icon name="arrow_drop_down"></forge-icon>
        </forge-icon-button>
      </forge-menu>
    `;
  }

  #handleClick(): void {
    this.dispatchEvent(
      new CustomEvent<IBreadcrumbSelectEventData>(BREADCRUMB_CONSTANTS.events.CRUMB_SELECT, {
        bubbles: true,
        composed: true,
        detail: { crumb: this.crumb, index: this.index }
      })
    );
  }

  #handleSiblingSelect(evt: CustomEvent): void {
    const value = evt.detail?.value;
    if (typeof value === 'string') {
      const siblingCrumb = this.crumb.siblingRoutes?.find(r => (r.path ?? r.label) === value);
      if (siblingCrumb) {
        this.dispatchEvent(
          new CustomEvent<IBreadcrumbSelectEventData>(BREADCRUMB_CONSTANTS.events.CRUMB_SELECT, {
            bubbles: true,
            composed: true,
            detail: { crumb: siblingCrumb, index: this.index }
          })
        );
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forge-crumb': CrumbComponent;
  }
}
