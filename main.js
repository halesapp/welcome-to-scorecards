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

const placeParkMenu = element => {
  const menu = document.createElement('div');
  menu.classList.add('interact-menu');
  const noElement = document.createElement('img');
  noElement.onclick = () => decrementPark(element)
  noElement.src = './no.png';
  noElement.alt = 'Cancel';
  noElement.classList.add('menu-icon');
  const yesElement = document.createElement('img');
  yesElement.onclick = () => incrementPark(element)
  yesElement.src = './yes.png';
  yesElement.alt = 'Apply';
  yesElement.classList.add('menu-icon');
  menu.appendChild(noElement);
  menu.appendChild(yesElement);
  // the no button should be to the left of the element and the yes button to the right
  const rect = element.getBoundingClientRect();
  menu.style.top = `${window.scrollY + rect.top - 8}px`;
  menu.style.left = `${window.scrollX + rect.left - 50}px`;
  menu.style.width = `${rect.width + 100}px`;
  menu.style.height = `${rect.height}px`;
  menu.style.display = 'flex';
  menu.style.justifyContent = 'space-between';

  document.body.appendChild(menu);
}

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

const calculateParkScores = () => {
  let totalScore = 0;
  [1, 2, 3]
    .forEach(streetNumber => {
        const scoredParks = document.querySelectorAll(`#parks${streetNumber} > div.park-marker.toggled`);
        let score = 2 * scoredParks.length;
        if (scoredParks.length === 2 + streetNumber) score += (2 * streetNumber + 2);
        document.getElementById(`street${streetNumber}-score-parks`).innerText = score;
        totalScore += score;
      }
    )
  document.getElementById('total-score-parks').innerText = totalScore;
}

const incrementPark = element => {
  // list the children of the element in order
  const children = Array.from(element.children);
  hideAllMenus()
  // the last element is a placeholder for spacing. if the 2nd to last is toggled, return
  if (children[children.length - 2].classList.contains('toggled')) {
    return false
  }
  children
    .slice(0, -1)
    .every(child => {
      if (!child.classList.contains('toggled')) {
        child.classList.add('toggled');
        return false
      }
      return true
    })
  calculateParkScores()
}

const decrementPark = element => {
  // if the first element is not toggled then quit early
  const children = Array.from(element.children);
  hideAllMenus()
  if (!children[0].classList.contains('toggled')) {
    return false
  }
  // go in reverse order starting from the 2nd to last element and remove the toggle on the first toggled element
  children
    .slice(0, -1)
    .reverse()
    .every(child => {
      if (child.classList.contains('toggled')) {
        child.classList.remove('toggled');
        return false
      }
      return true
    })
  calculateParkScores()
}

const hideAllMenus = () => {
  document.querySelectorAll('.highlight-box').forEach(e => e.remove());
  document.querySelectorAll('.interact-menu').forEach(e => e.remove());
}

document.querySelectorAll('.fence, .house, .pool, .park').forEach(element => {
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
          : element.classList.contains('park') ? 'park'
            : null;
    if (!type) return;

    if (type === "fence" || type === "pool") placeToggleMenu(element)
    if (type === "park") placeParkMenu(element)
  });
});
