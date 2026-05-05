import { html } from 'lit';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { standaloneStoryParams } from '../../utils.js';
import { IconRegistry } from '@tylertech/forge/icon';
import { tylIconFolder, tylIconDescription, tylIconSettings, tylIconHome } from '@tylertech/tyler-icons';

import '@tylertech/forge/breadcrumb';
import type { IBreadcrumbComponent } from '@tylertech/forge/breadcrumb';
import type { ICrumbConfiguration } from '@tylertech/forge/breadcrumb';

IconRegistry.define([tylIconFolder, tylIconDescription, tylIconSettings, tylIconHome]);

const component = 'forge-breadcrumb';

const basicCrumbs: ICrumbConfiguration[] = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Tyler Forge', path: '/projects/forge' },
  { label: 'Components' }
];

const richCrumbs: ICrumbConfiguration[] = [
  { label: 'Home', path: '/', icon: 'home' },
  {
    label: 'Projects',
    path: '/projects',
    icon: 'folder',
    secondary: 'All projects',
    siblingRoutes: [
      { label: 'Recent', path: '/projects/recent' },
      { label: 'Archived', path: '/projects/archived' }
    ]
  },
  {
    label: 'Tyler Forge',
    path: '/projects/forge',
    icon: 'description',
    secondary: 'Component library',
    siblingRoutes: [
      { label: 'Tyler Forms', path: '/projects/forms' },
      { label: 'Tyler Auth', path: '/projects/auth' }
    ]
  },
  { label: 'Components' }
];

const meta = {
  title: 'Components/Breadcrumb',
  tags: ['new'],
  render: args => {
    const el = document.createElement(component) as IBreadcrumbComponent & HTMLElement;
    el.crumbs = args.crumbs;
    el.showHome = args.showHome;
    el.separator = args.separator;
    return el;
  },
  component,
  parameters: {
    actions: { disable: true }
  },
  argTypes: {
    crumbs: { control: 'object' },
    showHome: { control: 'boolean' },
    separator: { control: 'select', options: ['slash_forward', 'chevron_right', 'arrow_right'] }
  },
  args: {
    crumbs: basicCrumbs,
    showHome: false,
    separator: 'slash_forward'
  }
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Demo: Story = {};

export const WithHomeButton: Story = {
  ...standaloneStoryParams,
  render: () => {
    const el = document.createElement(component) as IBreadcrumbComponent & HTMLElement;
    el.crumbs = basicCrumbs;
    el.showHome = true;
    return el;
  }
};

export const WithIcons: Story = {
  ...standaloneStoryParams,
  render: () => {
    const el = document.createElement(component) as IBreadcrumbComponent & HTMLElement;
    el.crumbs = richCrumbs;
    return el;
  }
};

export const AutoCollapse: Story = {
  ...standaloneStoryParams,
  render: () => html`
    <div style="width: 250px; border: 1px dashed var(--forge-theme-outline); padding: 8px; resize: horizontal; overflow: hidden;">
      <forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>
    </div>
  `
};

export const RichCrumbs: Story = {
  ...standaloneStoryParams,
  render: () => {
    const el = document.createElement(component) as IBreadcrumbComponent & HTMLElement;
    el.crumbs = richCrumbs;
    el.showHome = true;
    return el;
  }
};

export const CustomSeparator: Story = {
  ...standaloneStoryParams,
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <forge-breadcrumb .crumbs=${basicCrumbs} separator="slash_forward"></forge-breadcrumb>
      <forge-breadcrumb .crumbs=${basicCrumbs} separator="chevron_right"></forge-breadcrumb>
      <forge-breadcrumb .crumbs=${basicCrumbs} separator="arrow_right"></forge-breadcrumb>
    </div>
  `
};
