import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-lit';
import { html } from 'lit';

import type { BreadcrumbComponent } from './breadcrumb/breadcrumb.js';
import type { ICrumbConfiguration, IBreadcrumbSelectEventData } from './breadcrumb/breadcrumb-constants.js';
import { frame } from '../core/utils/utils.js';

import './breadcrumb/breadcrumb.js';
import './crumb/crumb.js';

const basicCrumbs: ICrumbConfiguration[] = [{ label: 'Home', path: '/' }, { label: 'Projects', path: '/projects' }, { label: 'Components' }];

describe('Breadcrumb', () => {
  it('should contain a shadow root', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;

    expect(el.shadowRoot).not.toBeNull();
  });

  it('should be accessible', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    await expect(el).toBeAccessible();
  });

  it('should render the correct number of crumbs from crumbs property', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const crumbEls = el.shadowRoot!.querySelectorAll('forge-crumb');
    expect(crumbEls.length).toBe(basicCrumbs.length);
  });

  it('should set aria-current="page" on the last crumb', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const crumbEls = el.shadowRoot!.querySelectorAll('forge-crumb');
    const lastCrumb = crumbEls[crumbEls.length - 1];
    await lastCrumb.updateComplete;
    const activeLi = lastCrumb.shadowRoot!.querySelector('[aria-current="page"]');
    expect(activeLi).not.toBeNull();
  });

  it('should render home button when show-home is set', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs} show-home></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const homeButton = el.shadowRoot!.querySelector('.forge-breadcrumb__home-button');
    expect(homeButton).not.toBeNull();
  });

  it('should not render home button when show-home is unset', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const homeButton = el.shadowRoot!.querySelector('.forge-breadcrumb__home-button');
    expect(homeButton).toBeNull();
  });

  it('should emit forge-breadcrumb-home-click when home button is clicked', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs} show-home></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const spy = vi.fn();
    el.addEventListener('forge-breadcrumb-home-click', spy);

    const homeButton = el.shadowRoot!.querySelector('.forge-breadcrumb__home-button') as HTMLElement;
    homeButton.click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should emit forge-breadcrumb-crumb-select with correct crumb and index when a crumb is clicked', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const spy = vi.fn();
    el.addEventListener('forge-breadcrumb-crumb-select', spy);

    const crumbEls = el.shadowRoot!.querySelectorAll('forge-crumb');
    const firstCrumb = crumbEls[0];
    await firstCrumb.updateComplete;
    const link = firstCrumb.shadowRoot!.querySelector('.forge-crumb__link') as HTMLElement;
    link.click();

    expect(spy).toHaveBeenCalledOnce();
    const detail = spy.mock.calls[0][0].detail as IBreadcrumbSelectEventData;
    expect(detail.crumb).toEqual(basicCrumbs[0]);
    expect(detail.index).toBe(0);
  });

  it('should render a custom separator icon when separator property is set', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs} separator="chevron_right"></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const crumbEls = el.shadowRoot!.querySelectorAll('forge-crumb');
    const nonLastCrumbs = Array.from(crumbEls).slice(0, -1);
    expect(nonLastCrumbs.length).toBeGreaterThan(0);

    for (const crumb of nonLastCrumbs) {
      await crumb.updateComplete;
      const sep = crumb.shadowRoot!.querySelector('.forge-crumb__separator') as any;
      expect(sep).not.toBeNull();
      expect(sep.name).toBe('chevron_right');
    }
  });

  it('should render a crumb icon when ICrumbConfiguration.icon is set', async () => {
    const crumbsWithIcon: ICrumbConfiguration[] = [{ label: 'Home', path: '/', icon: 'home' }, { label: 'End' }];
    const screen = render(html`<forge-breadcrumb .crumbs=${crumbsWithIcon}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const firstCrumb = el.shadowRoot!.querySelectorAll('forge-crumb')[0];
    await firstCrumb.updateComplete;
    const icon = firstCrumb.shadowRoot!.querySelector('.forge-crumb__icon');
    expect(icon).not.toBeNull();
  });

  it('should render secondary text when ICrumbConfiguration.secondary is set', async () => {
    const crumbsWithSecondary: ICrumbConfiguration[] = [{ label: 'Home', path: '/', secondary: 'Main page' }, { label: 'End' }];
    const screen = render(html`<forge-breadcrumb .crumbs=${crumbsWithSecondary}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const firstCrumb = el.shadowRoot!.querySelectorAll('forge-crumb')[0];
    await firstCrumb.updateComplete;
    const secondary = firstCrumb.shadowRoot!.querySelector('.forge-crumb__secondary-text');
    expect(secondary).not.toBeNull();
    expect(secondary!.textContent).toBe('Main page');
  });

  it('should render a sibling routes trigger when ICrumbConfiguration.siblingRoutes is set', async () => {
    const crumbsWithSiblings: ICrumbConfiguration[] = [
      {
        label: 'Projects',
        path: '/projects',
        siblingRoutes: [
          { label: 'Recent', path: '/recent' },
          { label: 'Archived', path: '/archived' }
        ]
      },
      { label: 'End' }
    ];
    const screen = render(html`<forge-breadcrumb .crumbs=${crumbsWithSiblings}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const firstCrumb = el.shadowRoot!.querySelectorAll('forge-crumb')[0];
    await firstCrumb.updateComplete;
    const siblingTrigger = firstCrumb.shadowRoot!.querySelector('.forge-crumb__sibling-trigger');
    expect(siblingTrigger).not.toBeNull();
  });

  it('should not render a sibling routes trigger when siblingRoutes is absent', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const firstCrumb = el.shadowRoot!.querySelectorAll('forge-crumb')[0];
    await firstCrumb.updateComplete;
    const siblingTrigger = firstCrumb.shadowRoot!.querySelector('.forge-crumb__sibling-trigger');
    expect(siblingTrigger).toBeNull();
  });

  it('should emit forge-breadcrumb-crumb-select with the sibling crumb when a sibling route is selected', async () => {
    const crumbsWithSiblings: ICrumbConfiguration[] = [
      {
        label: 'Projects',
        path: '/projects',
        siblingRoutes: [
          { label: 'Recent', path: '/recent' },
          { label: 'Archived', path: '/archived' }
        ]
      },
      { label: 'End' }
    ];
    const screen = render(html`<forge-breadcrumb .crumbs=${crumbsWithSiblings}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;

    const spy = vi.fn();
    el.addEventListener('forge-breadcrumb-crumb-select', spy);

    const firstCrumb = el.shadowRoot!.querySelectorAll('forge-crumb')[0];
    await firstCrumb.updateComplete;

    const menu = firstCrumb.shadowRoot!.querySelector('forge-menu')!;
    menu.dispatchEvent(new CustomEvent('forge-menu-select', { bubbles: true, composed: true, detail: { value: '/recent' } }));

    expect(spy).toHaveBeenCalledOnce();
    const detail = spy.mock.calls[0][0].detail as IBreadcrumbSelectEventData;
    expect(detail.crumb).toEqual(crumbsWithSiblings[0].siblingRoutes![0]);
    expect(detail.index).toBe(0);
  });

  it('should show collapsed menu trigger when content overflows container width', async () => {
    const manyCrumbs: ICrumbConfiguration[] = [
      { label: 'Level 1', path: '/1' },
      { label: 'Level 2', path: '/2' },
      { label: 'Level 3', path: '/3' },
      { label: 'Level 4', path: '/4' },
      { label: 'Level 5', path: '/5' },
      { label: 'Current Page' }
    ];

    const container = document.createElement('div');
    container.style.width = '150px';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const screen = render(html`<forge-breadcrumb .crumbs=${manyCrumbs}></forge-breadcrumb>`, { container });
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;
    await frame();
    await frame();
    await el.updateComplete;

    const collapsedTrigger = el.shadowRoot!.querySelector('.forge-breadcrumb__collapsed-trigger');
    expect(collapsedTrigger).not.toBeNull();

    container.remove();
  });

  it('should not show collapsed menu trigger when content fits container width', async () => {
    const shortCrumbs: ICrumbConfiguration[] = [{ label: 'A', path: '/a' }, { label: 'B' }];
    const screen = render(html`<forge-breadcrumb .crumbs=${shortCrumbs}></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;
    await el.updateComplete;
    await frame();
    await el.updateComplete;

    const collapsedTrigger = el.shadowRoot!.querySelector('.forge-breadcrumb__collapsed-trigger');
    expect(collapsedTrigger).toBeNull();
  });

  it('should reflect show-home attribute to property', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs} show-home></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;

    expect(el.showHome).toBe(true);
  });

  it('should reflect separator attribute to property', async () => {
    const screen = render(html`<forge-breadcrumb .crumbs=${basicCrumbs} separator="chevron_right"></forge-breadcrumb>`);
    const el = screen.container.querySelector('forge-breadcrumb') as BreadcrumbComponent;

    expect(el.separator).toBe('chevron_right');
  });
});
