import { defineCustomElement } from '@tylertech/forge-core';

import { BreadcrumbsComponent } from './breadcrumb/breadcrumb.js';
import { CrumbComponent } from './crumb/crumb.js';

export * from './breadcrumb/breadcrumb.js';
export * from './breadcrumb/breadcrumb-constants.js';
export * from './crumb/crumb.js';
export * from './crumb/crumb-constants.js';

/** @deprecated Definition functions are deprecated and replaced with side effect imports (`import '@tylertech/forge/breadcrumb'`). */
export function defineBreadcrumbsComponent(): void {
  defineCustomElement(BreadcrumbsComponent);
}

/** @deprecated Definition functions are deprecated and replaced with side effect imports (`import '@tylertech/forge/breadcrumb'`). */
export function defineCrumbComponent(): void {
  defineCustomElement(CrumbComponent);
}
