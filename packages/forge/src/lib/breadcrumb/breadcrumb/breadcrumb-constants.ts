import { COMPONENT_NAME_PREFIX } from '../../constants.js';

export const BREADCRUMB_TAG_NAME: keyof HTMLElementTagNameMap = `${COMPONENT_NAME_PREFIX}breadcrumb`;

export interface ICrumbConfiguration {
  label: string;
  path?: string;
  icon?: string;
  secondary?: string;
  siblingRoutes?: ICrumbConfiguration[];
}

export interface IBreadcrumbSelectEventData {
  crumb: ICrumbConfiguration;
  index: number;
}

export const BREADCRUMB_CONSTANTS = {
  events: {
    CRUMB_SELECT: 'forge-breadcrumb-crumb-select',
    HOME_CLICK: 'forge-breadcrumb-home-click'
  }
};

declare global {
  interface HTMLElementEventMap {
    'forge-breadcrumb-crumb-select': CustomEvent<IBreadcrumbSelectEventData>;
    'forge-breadcrumb-home-click': CustomEvent<void>;
  }
}
