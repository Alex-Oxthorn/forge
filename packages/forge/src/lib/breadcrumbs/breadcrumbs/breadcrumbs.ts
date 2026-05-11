import { CUSTOM_ELEMENT_DEPENDENCIES_PROPERTY, CUSTOM_ELEMENT_NAME_PROPERTY, ForgeResizeObserver } from '@tylertech/forge-core';
import { tylIconDotsHorizontal, tylIconHome, tylIconSlashForward } from '@tylertech/tyler-icons';
import { html, nothing, PropertyValues, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { BaseLitElement } from '../../core/base/base-lit-element.js';
import { setDefaultAria } from '../../core/utils/a11y-utils.js';
import { IconRegistry } from '../../icon/index.js';
import { IconButtonComponent } from '../../icon-button/index.js';
import { IconComponent } from '../../icon/index.js';
import { MenuComponent } from '../../menu/index.js';
import { TooltipComponent } from '../../tooltip/index.js';

import '../../icon/icon.js';
import '../../icon-button/icon-button.js';
import '../../menu/menu.js';
import '../../tooltip/tooltip.js';
import '../crumb/crumb.js';

import { ICrumbConfiguration, IBreadcrumbsSelectEventData, BREADCRUMBS_CONSTANTS, BREADCRUMBS_TAG_NAME } from './breadcrumbs-constants.js';
import { CrumbComponent } from '../crumb/crumb.js';
import type { IMenuOption } from '../../menu/menu-constants.js';

import styles from './breadcrumbs.scss';

/**
 * @tag forge-breadcrumbs
 *
 * @summary A responsive breadcrumb navigation component that automatically collapses when space is limited.
 *
 * @description
 * The breadcrumb component displays a navigation path showing the user's location within a
 * hierarchical structure. It supports icons, secondary text, sibling route navigation, and
 * automatically collapses into a menu when the container width is insufficient.
 *
 * @csspart root - The root navigation element.
 *
 * @cssproperty --forge-breadcrumbs-gap - The gap between breadcrumb items.
 * @cssproperty --forge-breadcrumbs-separator-theme - The color theme for separator icons.
 *
 * @dependency forge-tooltip
 *
 * @property {string} [homeTooltip='Home'] - The tooltip text for the home button.
 * @attribute {string} [home-tooltip='Home'] - The tooltip text for the home button.
 *
 * @property {string} [expandLabel='Show all breadcrumbs'] - The aria-label for the collapsed breadcrumbs trigger button.
 * @attribute {string} [expand-label='Show all breadcrumbs'] - The aria-label for the collapsed breadcrumbs trigger button.
 *
 * @property {string} [siblingRoutesLabel='Sibling routes'] - The aria-label for the sibling routes trigger button within each crumb.
 * @attribute {string} [sibling-routes-label='Sibling routes'] - The aria-label for the sibling routes trigger button within each crumb.
 *
 * @fires {CustomEvent<IBreadcrumbsSelectEventData>} forge-breadcrumbs-crumb-select - Dispatched when a crumb is clicked.
 * @fires {CustomEvent<void>} forge-breadcrumbs-home-click - Dispatched when the home button is clicked.
 */
@customElement(BREADCRUMBS_TAG_NAME)
export class BreadcrumbsComponent extends BaseLitElement {
  static {
    IconRegistry.define([tylIconSlashForward, tylIconDotsHorizontal, tylIconHome]);
  }

  public static styles = unsafeCSS(styles);

  /** @deprecated Used for compatibility with legacy Forge @customElement decorator. */
  public static [CUSTOM_ELEMENT_NAME_PROPERTY] = BREADCRUMBS_TAG_NAME;

  /** @deprecated Used for compatibility with legacy Forge @customElement decorator. */
  public static [CUSTOM_ELEMENT_DEPENDENCIES_PROPERTY] = [CrumbComponent, IconButtonComponent, IconComponent, MenuComponent, TooltipComponent];

  /**
   * The breadcrumb items to render.
   * @default []
   */
  @property({ attribute: false })
  public crumbs: ICrumbConfiguration[] = [];

  /**
   * Whether to show the home button at the start.
   * @attribute show-home
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-home' })
  public showHome = false;

  /**
   * The icon name for the separator between crumbs.
   * @attribute separator-icon-name
   * @default 'slash_forward'
   */
  @property({ attribute: 'separator-icon-name' })
  public separatorIconName = 'slash_forward';

  /**
   * The tooltip text for the home button.
   * @attribute home-tooltip
   * @default 'Home'
   */
  @property({ attribute: 'home-tooltip' })
  public homeTooltip = 'Home';

  /**
   * The aria-label for the collapsed breadcrumbs trigger button.
   * @attribute expand-label
   * @default 'Show all breadcrumbs'
   */
  @property({ attribute: 'expand-label' })
  public expandLabel = 'Show all breadcrumbs';

  /**
   * The aria-label for the sibling routes trigger button within each crumb.
   * @attribute sibling-routes-label
   * @default 'Sibling routes'
   */
  @property({ attribute: 'sibling-routes-label' })
  public siblingRoutesLabel = 'Sibling routes';

  @state()
  private _collapsed = false;

  @state()
  private _expandedContentWidth = 0;

  @query('.forge-breadcrumbs', true)
  private _listEl!: HTMLElement;

  #internals: ElementInternals;
  #containerWidth = Infinity;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  public override firstUpdated(): void {
    setDefaultAria(this, this.#internals, { role: 'navigation', ariaLabel: 'Breadcrumbs' });
    this.#setupResizeObserver();
  }

  public override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('crumbs') || changedProperties.has('showHome') || changedProperties.has('separatorIconName')) {
      this._collapsed = false;
      requestAnimationFrame(() => {
        if (this._listEl) {
          this._expandedContentWidth = this._listEl.scrollWidth;
          this.#checkCollapse();
        }
      });
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    ForgeResizeObserver.unobserve(this);
  }

  public render(): TemplateResult {
    return html`
      <nav part="root">
        <ol class="forge-breadcrumbs">
          ${this.#renderHomeButton()} ${this._collapsed ? this.#renderCollapsed() : this.#renderExpanded()}
        </ol>
      </nav>
    `;
  }

  #renderHomeButton(): TemplateResult | typeof nothing {
    if (!this.showHome) {
      return nothing;
    }
    return html`
      <li class="forge-breadcrumbs__crumb-item">
        <forge-icon-button class="forge-breadcrumbs__home-button" aria-label=${this.homeTooltip} @click=${this.#handleHomeClick}>
          <forge-icon name="home"></forge-icon>
        </forge-icon-button>
        <forge-tooltip>${this.homeTooltip}</forge-tooltip>
        ${this.#renderSeparator()}
      </li>
    `;
  }

  #renderSeparator(): TemplateResult {
    return html`<forge-icon class="forge-breadcrumbs__separator" .name=${this.separatorIconName}></forge-icon>`;
  }

  #renderExpanded(): TemplateResult[] {
    return this.crumbs.map((crumb, index) => {
      const isLast = index === this.crumbs.length - 1;
      return html`
        <li class="forge-breadcrumbs__crumb-item">
          <forge-crumb
            .crumb=${crumb}
            .index=${index}
            ?active=${isLast}
            .separator=${!isLast ? this.separatorIconName : ''}
            .siblingRoutesLabel=${this.siblingRoutesLabel}>
          </forge-crumb>
        </li>
      `;
    });
  }

  #renderCollapsed(): TemplateResult {
    const collapsedCrumbs = this.crumbs.slice(0, -1);
    const lastCrumb = this.crumbs.at(-1);

    const menuOptions: IMenuOption[] = collapsedCrumbs.map((c, i) => ({
      label: c.label,
      value: i,
      secondaryLabel: c.secondary,
      leadingIcon: c.icon,
      leadingIconType: 'component'
    }));

    return html`
      <li class="forge-breadcrumbs__crumb-item">
        <forge-menu .options=${menuOptions} @forge-menu-select=${this.#handleCollapsedMenuSelect}>
          <forge-icon-button class="forge-breadcrumbs__collapsed-trigger" aria-label=${this.expandLabel}>
            <forge-icon name="dots_horizontal"></forge-icon>
          </forge-icon-button>
        </forge-menu>
        ${this.#renderSeparator()}
      </li>
      ${lastCrumb
        ? html`
            <li class="forge-breadcrumbs__crumb-item">
              <forge-crumb .crumb=${lastCrumb} .index=${this.crumbs.length - 1} active .siblingRoutesLabel=${this.siblingRoutesLabel}> </forge-crumb>
            </li>
          `
        : nothing}
    `;
  }

  #setupResizeObserver(): void {
    if (!this._listEl) {
      return;
    }

    ForgeResizeObserver.observe(this, entry => {
      this.#containerWidth = entry.contentRect.width;
      this.#checkCollapse();
    });
  }

  #checkCollapse(): void {
    if (this._expandedContentWidth > 0 && this._expandedContentWidth > this.#containerWidth) {
      if (!this._collapsed) {
        this._collapsed = true;
      }
    } else if (this._collapsed) {
      this._collapsed = false;
    }
  }

  #handleHomeClick(): void {
    this.dispatchEvent(
      new CustomEvent<void>(BREADCRUMBS_CONSTANTS.events.HOME_CLICK, {
        bubbles: true,
        composed: true
      })
    );
  }

  #handleCollapsedMenuSelect(evt: CustomEvent): void {
    const index = evt.detail?.value;
    if (typeof index === 'number' && index >= 0 && index < this.crumbs.length) {
      const crumb = this.crumbs[index];
      this.dispatchEvent(
        new CustomEvent<IBreadcrumbsSelectEventData>(BREADCRUMBS_CONSTANTS.events.CRUMB_SELECT, {
          bubbles: true,
          composed: true,
          detail: { crumb, index }
        })
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'forge-breadcrumbs': BreadcrumbsComponent;
  }
}
