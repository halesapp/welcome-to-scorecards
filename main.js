const placeToggleMenu = element => {
  const menuHeight = 50; // px
  const menuWidth = 100; // px
  const menu = document.createElement('div');
  menu.classList.add('interact-menu');
  menu.style.width = `${menuWidth}px`;
  menu.style.height = `${menuHeight}px`;
  const noElement = document.createElement('img');
  noElement.onclick = () => removeToggle(element)
  noElement.src = './no.png';
  noElement.alt = 'Cancel';
  noElement.classList.add('menu-icon');
  const yesElement = document.createElement('img');
  yesElement.onclick = () => addToggle(element)
  yesElement.src = './yes.png';
  yesElement.alt = 'Apply';
  yesElement.classList.add('menu-icon');
  menu.appendChild(noElement);
  menu.appendChild(yesElement);

  // Position the menu above the clicked element
  const rect = element.getBoundingClientRect();
  const spacing = 10;
  menu.style.top = `${window.scrollY + rect.top - menuHeight - spacing}px`;
  menu.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2)}px`;

  document.body.appendChild(menu);
};

const addToggle = element => {
  if (!element.classList.contains('toggled')) {
    element.classList.add('toggled');
  }
  hideAllMenus()
}

const removeToggle = element => {
  if (element.classList.contains('toggled')) {
    element.classList.remove('toggled');
  }
  hideAllMenus()
}

const hideAllMenus = () => {
  document.querySelectorAll('.highlight-box').forEach(e => e.remove());
  document.querySelectorAll('.interact-menu').forEach(e => e.remove());
}

document.querySelectorAll('.fence, .house, .pool').forEach(element => {
  element.addEventListener('click', () => {
    hideAllMenus()
    // Get the bounding box of the clicked element
    const rect = element.getBoundingClientRect();

    // Create the highlight element
    const highlight = document.createElement('div');
    highlight.classList.add('highlight-box');

    // Position it absolutely around the clicked element
    const padding = 10; // px
    highlight.style.top = `${window.scrollY + rect.top - padding}px`;
    highlight.style.left = `${window.scrollX + rect.left - padding}px`;
    highlight.style.width = `${rect.width + padding}px`;
    highlight.style.height = `${rect.height + padding}px`;

    document.body.appendChild(highlight);

    // Create the interaction menu
    const type = element.classList.contains('fence') ? 'fence'
      : element.classList.contains('house') ? 'house'
        : element.classList.contains('pool') ? 'pool'
          : null;
    if (!type) return;

    if (type === "fence" || type === "pool") placeToggleMenu(element)

  });
});
