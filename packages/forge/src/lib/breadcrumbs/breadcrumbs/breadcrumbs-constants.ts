import { COMPONENT_NAME_PREFIX } from '../../constants.js';

export const BREADCRUMBS_TAG_NAME: keyof HTMLElementTagNameMap = `${COMPONENT_NAME_PREFIX}breadcrumbs`;

export interface ICrumbConfiguration {
  label: string;
  path?: string;
  icon?: string;
  secondary?: string;
  siblingRoutes?: ICrumbConfiguration[];
}

export interface IBreadcrumbsSelectEventData {
  crumb: ICrumbConfiguration;
  index: number;
}

export const BREADCRUMBS_CONSTANTS = {
  events: {
    CRUMB_SELECT: 'forge-breadcrumbs-crumb-select',
    HOME_CLICK: 'forge-breadcrumbs-home-click'
  }
};

declare global {
  interface HTMLElementEventMap {
    'forge-breadcrumbs-crumb-select': CustomEvent<IBreadcrumbsSelectEventData>;
    'forge-breadcrumbs-home-click': CustomEvent<void>;
  }
}
