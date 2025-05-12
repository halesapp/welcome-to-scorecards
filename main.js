const newNoElement = onclick => {
  const noElement = document.createElement('img')
  noElement.src = './no.png'
  noElement.alt = 'Cancel'
  noElement.classList.add('menu-icon')
  noElement.onclick = onclick
  return noElement
}

const newYesElement = onclick => {
  const yesElement = document.createElement('img')
  yesElement.src = './yes.png'
  yesElement.alt = 'Apply'
  yesElement.classList.add('menu-icon')
  yesElement.onclick = onclick
  return yesElement
}

const newPlusElement = onclick => {
  const plusElement = document.createElement('div')
  plusElement.innerText = '+'
  plusElement.classList.add('menu-icon');
  plusElement.classList.add('incrementing-icons');
  plusElement.onclick = onclick;
  return plusElement;
}

const newMinusElement = onclick => {
  const minusElement = document.createElement('div')
  minusElement.innerText = '-'
  minusElement.classList.add('menu-icon');
  minusElement.classList.add('incrementing-icons');
  minusElement.onclick = onclick;
  return minusElement;
}

const placeToggleMenu = element => {
  const menuHeight = 50 // px
  const menuWidth = 100 // px
  const menu = document.createElement('div');
  menu.classList.add('interact-menu')
  menu.style.width = `${menuWidth}px`
  menu.style.height = `${menuHeight}px`
  const noElement = newNoElement(() => removeToggle(element))
  const yesElement = newYesElement(() => addToggle(element))
  menu.appendChild(noElement)
  menu.appendChild(yesElement)

  // Position the menu above the clicked element
  const rect = element.getBoundingClientRect()
  const spacing = 10
  menu.style.top = `${window.scrollY + rect.top - menuHeight - spacing}px`
  menu.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2)}px`
  document.body.appendChild(menu);
};

const placeIncrementableMenu = ({element, alignment}) => {
  const menu = document.createElement('div')
  menu.classList.add('interact-menu')
  const noElement = newMinusElement(() => decrementMarkerChildren(element))
  const yesElement = newPlusElement(() => incrementMarkerChildren(element))
  menu.appendChild(noElement)
  menu.appendChild(yesElement)
  // the no button should be to the left of the element and the yes button to the right
  const rect = element.getBoundingClientRect()

  alignment = alignment || 'vertical'
  if (alignment === 'vertical') {
    const spacing = 10
    const menuHeight = 50 // px
    const menuWidth = 100 // px
    menu.style.top = `${window.scrollY + rect.top - menuHeight - spacing}px`
    menu.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2)}px`
  } else if (alignment === 'horizontal') {
    menu.style.top = `${window.scrollY + rect.top - 8}px`
    menu.style.left = `${window.scrollX + rect.left - 60}px`
    menu.style.width = `${rect.width + 120}px`
    menu.style.height = `${rect.height}px`
    menu.style.display = 'flex'
    menu.style.justifyContent = 'space-between'
  }
  document.body.appendChild(menu);
}

const placeHouseMenu = element => {
  const menuHeight = 60 // px
  const menuWidth = 100 // px
  const menu = document.createElement('div')
  menu.classList.add('interact-menu')
  menu.style.minWidth = `${menuWidth}px`
  menu.style.minHeight = `${menuHeight}px`
  menu.style.display = 'flex'
  menu.style.alignItems = 'center'
  menu.style.justifyContent = 'center'

  const numberInput = document.createElement('input')
  numberInput.type = 'number'
  numberInput.min = -1
  numberInput.max = 17
  numberInput.step = 1
  numberInput.value = element.innerText || ""
  numberInput.style.width = '75px'
  numberInput.style.height = '50px'
  numberInput.style.textAlign = 'center'
  numberInput.style.border = '4px solid black'
  numberInput.style.borderRadius = '35%'
  numberInput.style.background = 'white'
  numberInput.onchange = () => {
    if (numberInput.value === "") {
      element.innerText = "";
    } else {
      element.innerText = parseInt(numberInput.value);
    }
  }
  menu.append(numberInput);

  // Position the menu above the clicked element
  const rect = element.getBoundingClientRect()
  const spacing = 10;
  menu.style.top = `${window.scrollY + rect.top - menuHeight - spacing}px`;
  menu.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2)}px`;

  document.body.appendChild(menu);
}

const addToggle = element => {
  hideAllMenus()
  if (!element.classList.contains('toggled')) {
    element.classList.add('toggled');
  }
  calculateScores()
}

const removeToggle = element => {
  hideAllMenus()
  if (element.classList.contains('toggled')) {
    element.classList.remove('toggled');
  }
  calculateScores()
}

const calculateScores = () => {
  //////// Calculate Pool Scores
  let poolTotal = 0;
  const toggledPools = document.querySelectorAll('.pool.toggled');
  const poolMarkers = Array.from(document.querySelectorAll('#scores-pools > .marker')).slice(0, -1);
  poolMarkers.forEach((element, index) => {
    if (index < toggledPools.length) {
      if (!element.classList.contains('toggled')) {
        element.classList.add('toggled');
      }
    } else {
      element.classList.remove('toggled');
    }
  })

  poolTotal += 3 * toggledPools.length;
  if (toggledPools.length >= 4) poolTotal += toggledPools.length - 3;
  if (toggledPools.length >= 7) poolTotal += toggledPools.length - 6;
  document.getElementById('total-score-pools').innerText = poolTotal;

  //////// Calculate Park Scores
  let parkTotal = 0;
  [1, 2, 3]
    .forEach(streetNumber => {
        const scoredParks = document.querySelectorAll(`#parks${streetNumber} > .marker.toggled`);
        let score = 2 * scoredParks.length;
        if (scoredParks.length === 2 + streetNumber) score += (2 * streetNumber + 2);
        document.getElementById(`street${streetNumber}-score-parks`).innerText = score;
        parkTotal += score;
      }
    )
  document.getElementById('total-score-parks').innerText = parkTotal;
}

const incrementMarkerChildren = element => {
  const children = Array.from(element.children);
  hideAllMenus()
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
  calculateScores()
}

const decrementMarkerChildren = element => {
  const children = Array.from(element.children);
  hideAllMenus()
  if (!children[0].classList.contains('toggled')) {
    return false
  }
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
  calculateScores()
}

const hideAllMenus = () => {
  document.querySelectorAll('.highlight-box').forEach(e => e.remove());
  document.querySelectorAll('.interact-menu').forEach(e => e.remove());
}

document.querySelectorAll('.fence, .house, .pool, .park, .construction-markers, .estate-values, #scores-bis').forEach(element => {
  element.addEventListener('click', event => {
    event.stopImmediatePropagation()
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
    const classes = element.classList;
    if (classes.contains('fence') || classes.contains('pool')) placeToggleMenu(element)
    else if (classes.contains('park')) placeIncrementableMenu({element, alignment: "horizontal"})
    else if (classes.contains('estate-values') || classes.contains('construction-markers') || element.id === "scores-bis") placeIncrementableMenu({element, alignment: "vertical"})
    else if (classes.contains('house')) placeHouseMenu(element)
  });
});

document.addEventListener('click', event => {
  const isMenuOrHighlight = event.target.closest('.interact-menu') || event.target.closest('.highlight-box');
  if (!isMenuOrHighlight) {
    hideAllMenus();
  }
});