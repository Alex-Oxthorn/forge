import '$src/shared';
import '@tylertech/forge/breadcrumbs';
import type { BreadcrumbsComponent, ICrumbConfiguration } from '@tylertech/forge/breadcrumbs';
import type { SwitchComponent } from '@tylertech/forge/switch';
import type { SelectComponent } from '@tylertech/forge/select';
import { IconRegistry } from '@tylertech/forge/icon';
import { tylIconFolder, tylIconDescription, tylIconSettings, tylIconHome, tylIconChevronRight, tylIconArrowRight } from '@tylertech/tyler-icons';

import './breadcrumbs.scss';

IconRegistry.define([tylIconFolder, tylIconDescription, tylIconSettings, tylIconHome, tylIconChevronRight, tylIconArrowRight]);

let showIcons = false;
let showSecondary = false;
let showSiblings = false;

const baseCrumbs: ICrumbConfiguration[] = [
  { label: 'Section 1', path: '/' },
  { label: 'Section 2', path: '/projects' },
  { label: 'Section 3', path: '/projects/forge' },
  { label: 'Current' }
];

const buildCrumbs = (): ICrumbConfiguration[] =>
  baseCrumbs.map((c, i) => ({
    ...c,
    icon: showIcons && i < baseCrumbs.length - 1 ? ['home', 'folder', 'description', 'settings'][i] : undefined,
    secondary: showSecondary && i < baseCrumbs.length - 1 ? `Level ${i + 1}` : undefined,
    siblingRoutes:
      showSiblings && i > 0 && i < baseCrumbs.length - 1
        ? [
            { label: `${c.label} Alt A`, path: `${c.path}-a` },
            { label: `${c.label} Alt B`, path: `${c.path}-b` }
          ]
        : undefined
  }));

const breadcrumbs = document.querySelectorAll<BreadcrumbsComponent & HTMLElement>('forge-breadcrumbs');

const updateAll = (): void => {
  const crumbs = buildCrumbs();
  breadcrumbs.forEach(bc => {
    bc.crumbs = crumbs;
  });
};

updateAll();

const showHomeSwitch = document.getElementById('opt-show-home') as SwitchComponent;
const separatorSelect = document.getElementById('opt-separator') as SelectComponent;
const iconsSwitch = document.getElementById('opt-icons') as SwitchComponent;
const secondarySwitch = document.getElementById('opt-secondary') as SwitchComponent;
const siblingsSwitch = document.getElementById('opt-siblings') as SwitchComponent;
const addBtn = document.getElementById('btn-add-crumb');
const removeBtn = document.getElementById('btn-remove-crumb');

iconsSwitch.checked = showIcons;
secondarySwitch.checked = showSecondary;
siblingsSwitch.checked = showSiblings;

if (showHomeSwitch) {
  showHomeSwitch.addEventListener('forge-switch-change', () => {
    breadcrumbs.forEach(bc => {
      bc.showHome = showHomeSwitch.checked;
    });
  });
}

if (separatorSelect) {
  separatorSelect.addEventListener('change', () => {
    breadcrumbs.forEach(bc => {
      bc.separatorIconName = separatorSelect.value;
    });
  });
}

if (iconsSwitch) {
  iconsSwitch.addEventListener('forge-switch-change', () => {
    showIcons = iconsSwitch.checked;
    updateAll();
  });
}

if (secondarySwitch) {
  secondarySwitch.addEventListener('forge-switch-change', () => {
    showSecondary = secondarySwitch.checked;
    updateAll();
  });
}

if (siblingsSwitch) {
  siblingsSwitch.addEventListener('forge-switch-change', () => {
    showSiblings = siblingsSwitch.checked;
    updateAll();
  });
}

if (addBtn) {
  addBtn.addEventListener('click', () => {
    baseCrumbs.splice(baseCrumbs.length - 1, 0, {
      label: `Section ${baseCrumbs.length}`,
      path: `/section-${baseCrumbs.length}`
    });
    updateAll();
  });
}

if (removeBtn) {
  removeBtn.addEventListener('click', () => {
    if (baseCrumbs.length > 1) {
      baseCrumbs.splice(baseCrumbs.length - 2, 1);
      updateAll();
    }
  });
}

window.addEventListener('forge-breadcrumbs-crumb-select', evt => {
  console.log('Crumb selected:', (evt as CustomEvent).detail);
});

window.addEventListener('forge-breadcrumbs-home-click', () => {
  console.log('Home clicked');
});
