// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const tabsRef = block.dataset.tabGroupTabs;
  const tabsAlt = block.dataset.tabGroupTabsAlt;

  if (!block.children.length && tabsRef) {
    const tabNames = tabsRef.split(',').map((t) => t.trim());
    tabNames.forEach((tabName) => {
      const panel = document.createElement('div');
      panel.innerHTML = `<div>${tabName}</div><p>${tabsAlt || `Content for ${tabName}`}</p>`;
      block.append(panel);
    });
  }

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, index) => {
    const id = toClassName(tab.textContent);

    const tabpanel = block.children[index];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!index);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !index);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => panel.setAttribute('aria-hidden', true));
      tablist.querySelectorAll('button').forEach((btn) => btn.setAttribute('aria-selected', false));
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}
