import { BaseComponentDelegate, IBaseComponentDelegateConfig, IBaseComponentDelegateOptions } from '../../core/delegates/base-component-delegate.js';
import { BreadcrumbComponent, IBreadcrumbComponent } from './breadcrumb.js';
import { ICrumbConfiguration, BREADCRUMB_TAG_NAME } from './breadcrumb-constants.js';

export type BreadcrumbComponentDelegateProps = Partial<IBreadcrumbComponent>;

export interface IBreadcrumbComponentDelegateOptions extends IBaseComponentDelegateOptions {
  crumbs?: ICrumbConfiguration[];
  showHome?: boolean;
  separator?: string;
}

export interface IBreadcrumbComponentDelegateConfig extends IBaseComponentDelegateConfig<BreadcrumbComponent, IBreadcrumbComponentDelegateOptions> {}

export class BreadcrumbComponentDelegate extends BaseComponentDelegate<BreadcrumbComponent, IBreadcrumbComponentDelegateOptions> {
  constructor(config?: IBreadcrumbComponentDelegateConfig) {
    super(config);
  }

  protected _build(): BreadcrumbComponent {
    const component = document.createElement(BREADCRUMB_TAG_NAME) as BreadcrumbComponent;
    if (this._config.options?.crumbs) {
      component.crumbs = this._config.options.crumbs;
    }
    if (this._config.options?.showHome != null) {
      component.showHome = this._config.options.showHome;
    }
    if (this._config.options?.separator) {
      component.separator = this._config.options.separator;
    }
    return component;
  }

  public onCrumbSelect(listener: (evt: CustomEvent) => void): void {
    this._element.addEventListener('forge-breadcrumb-crumb-select', listener as EventListener);
  }

  public onHomeClick(listener: (evt: CustomEvent) => void): void {
    this._element.addEventListener('forge-breadcrumb-home-click', listener as EventListener);
  }
}
