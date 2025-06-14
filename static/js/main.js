const newImgElement = (src, alt, onclick) => {
  const imgElement = document.createElement('img')
  imgElement.src = src
  imgElement.alt = alt
  imgElement.classList.add('menu-icon')
  imgElement.onclick = onclick
  return imgElement
}

const newDivElement = (text, onclick) => {
  const divElement = document.createElement('div')
  divElement.innerText = text
  divElement.classList.add('menu-icon')
  divElement.classList.add('incrementing-icons')
  divElement.onclick = onclick;
  return divElement;
}

const placeToggleMenu = element => {
  const menuHeight = 50 // px
  const menuWidth = 100 // px
  const menu = document.createElement('div');
  menu.classList.add('interact-menu')
  menu.style.width = `${menuWidth}px`
  menu.style.height = `${menuHeight}px`
  const noElement = newImgElement('./static/images/no.svg', 'Cancel', () => removeToggle(element))
  const yesElement = newImgElement('./static/images/yes.svg', 'Apply', () => addToggle(element))
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
  const noElement = newDivElement('-', () => decrementMarkerChildren(element))
  const yesElement = newDivElement('+', () => incrementMarkerChildren(element))
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
    cacheDataKeys()
    calculateScores()
  }
  menu.append(numberInput);

  // Position the menu above the clicked element
  const rect = element.getBoundingClientRect()
  const spacing = 10;
  menu.style.top = `${window.scrollY + rect.top - menuHeight - spacing}px`;
  menu.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (menuWidth / 2)}px`;

  document.body.appendChild(menu);
  numberInput.focus()
}

const addToggle = element => {
  hideAllMenus()
  if (!element.classList.contains('toggled')) {
    element.classList.add('toggled');
  }
  cacheDataKeys()
  calculateScores()
}

const removeToggle = element => {
  hideAllMenus()
  if (element.classList.contains('toggled')) {
    element.classList.remove('toggled');
  }
  cacheDataKeys()
  calculateScores()
}

const calculateScores = () => {
  //////// Calculate Objective Scores
  const objectiveTotal = Array.from(document.querySelectorAll('.objective')).reduce((acc, objective) => acc + (parseInt(objective.innerText) || 0), 0)
  document.getElementById('total-score-objectives').innerText = objectiveTotal

  //////// Calculate Park Scores
  let parkTotal = 0;
  [1, 2, 3]
    .forEach(streetNumber => {
        const scoredParks = document.querySelectorAll(`#parks-${streetNumber} > .marker.toggled`);
        let score = 2 * scoredParks.length;
        if (scoredParks.length === 2 + streetNumber) score += (2 * streetNumber + 2);
        document.getElementById(`street${streetNumber}-score-parks`).innerText = score;
        parkTotal += score;
      }
    )
  document.getElementById('total-score-parks').innerText = parkTotal

  //////// Calculate Pool Scores
  let poolTotal = 0
  const toggledPools = document.querySelectorAll('.pool.toggled')
  const poolMarkers = Array.from(document.querySelectorAll('#markers-pools > .marker'))
  poolMarkers.forEach((element, index) => {
    if (index < toggledPools.length) {
      if (!element.classList.contains('toggled')) {
        element.classList.add('toggled');
      }
    } else {
      element.classList.remove('toggled');
    }
  })
  poolTotal += 3 * toggledPools.length
  if (toggledPools.length >= 4) poolTotal += toggledPools.length - 3
  if (toggledPools.length >= 7) poolTotal += toggledPools.length - 6
  document.getElementById('total-score-pools').innerText = poolTotal

  //////// Calculate Estate Points
  let estateTotal = 0
  const estateSizes = [1, 2, 3, 4, 5, 6]
  const estates = identifyEstates()
  const estatePoints = {
    "1": [1, 3],
    "2": [2, 3, 4],
    "3": [3, 4, 5, 6],
    "4": [4, 5, 6, 7, 8],
    "5": [5, 6, 7, 8, 10],
    "6": [6, 7, 8, 10, 12]
  }
  estateSizes.forEach(size => {
    const nEstates = estates.filter(e => e === size).length
    const nEstateToggles = document.querySelectorAll(`#markers-estate-${size} > .marker.toggled`).length
    const points = nEstates * estatePoints[size][nEstateToggles]
    document.getElementById(`estate-counter-${size}`).innerText = nEstates
    document.getElementById(`total-score-estate-${size}`).innerText = points
    estateTotal += points
  })

  //////// Calculate Bis Penalties
  const bisPoints = [0, 1, 3, 6, 9, 12, 16, 20, 24, 28]
  const bisCount = document.querySelectorAll('#markers-bises > .marker.toggled').length
  document.getElementById('total-score-bis').innerText = bisPoints[bisCount]

  //////// Calculate Skips Penalties
  const skipPoints = [0, 0, 3, 5]
  const skipsCount = document.querySelectorAll('#markers-skips > .marker.toggled').length
  document.getElementById('total-score-skips').innerText = skipPoints[skipsCount]

  //////// Calculate Total Score
  document.getElementById('total-score').innerText = objectiveTotal + parkTotal + poolTotal + estateTotal - bisPoints[bisCount] - skipPoints[skipsCount]
}

const incrementMarkerChildren = element => {
  hideAllMenus()
  let children = Array.from(element.children);
  if (element.classList.contains('bises')) children = children.slice(0, -1)
  children.every(child => !child.classList.contains('toggled') ? child.classList.add('toggled') : true)
  cacheDataKeys()
  calculateScores()
}

const decrementMarkerChildren = element => {
  hideAllMenus()
  let children = Array.from(element.children).reverse()
  if (element.classList.contains('bises')) children = children.slice(1)
  children.every(child => child.classList.contains('toggled') ? child.classList.remove('toggled') : true)
  cacheDataKeys()
  calculateScores()
}

const hideAllMenus = () => {
  document.querySelectorAll('.highlight-box').forEach(e => e.remove());
  document.querySelectorAll('.interact-menu').forEach(e => e.remove());
}

const identifyEstates = () => {
  const streetNumbers = [1, 2, 3]
  return streetNumbers.map(number => {
    // all houses on the street are selected so the first and last element can never be fences
    let streetComposition = Array.from(document.querySelectorAll(`#street-${number} > .fence.toggled, #street-${number} > .lot > .house`))
    if (streetComposition.length <= 1) return

    // if there are no fences, there are no estates
    let fenceIndices = streetComposition.map((e, i) => e.classList.contains('fence') ? i : -1).filter(i => i !== -1)
    if (fenceIndices.length === 0) return

    // iterate on the fenceIndices and check if the houses between the fences are built (number in the innerText)
    // to make the iteration logic easier, add a fence to the end of the fenceIndices array
    // If it's the first fence, slice up to the first fence, else slice between the previous fence and the current one.
    fenceIndices.push(streetComposition.length)
    let estates = fenceIndices.map((streetIndex, i) => {
      let housesToEvaluate = i === 0 ? streetComposition.slice(0, streetIndex) : streetComposition.slice(fenceIndices[i - 1] + 1, streetIndex)
      // max estate size is 6
      if (housesToEvaluate.length > 6) return 0
      // all houses must be built (innerText !== "")
      if (housesToEvaluate.filter(e => e.innerText !== "").length !== housesToEvaluate.length) return 0
      // otherwise the estate is valid
      return housesToEvaluate.length
    })
    // remove the zeros
    estates = estates.filter(e => e !== 0)
    return estates
  }).flat()
}

const cacheDataKeys = () => {
  const cache = {}
  dataKeys.forEach(element => {
    const key = element.getAttribute('data-key');
    if (key === 'city-name') {
      cache[key] = element.value || ""
    } else if (key.startsWith('house') || key.startsWith('objective')) {
      cache[key] = element.innerText || ""
    } else {
      cache[key] = element.classList.contains('toggled')
    }
  });
  localStorage.setItem('cache', JSON.stringify(cache))
}

const clearDataKeys = () => {
  dataKeys.forEach(element => {
    if (element.getAttribute('data-key') === 'city-name') {
      element.value = ""
    } else if (element.getAttribute('data-key').startsWith('house') || element.getAttribute('data-key').startsWith('objective')) {
      element.innerText = ""
    } else {
      element.classList.remove('toggled')
    }
  });
  localStorage.removeItem('cache')
  calculateScores()
}

const applyDataKeysCache = cache => {
  dataKeys.forEach(element => {
    const key = element.getAttribute('data-key');
    if (cache[key] === undefined) return
    if (key === 'city-name') {
      element.value = cache[key] || ""
    } else if (key.startsWith('house') || key.startsWith('objective')) {
      element.innerText = cache[key] || ""
    } else {
      if (cache[key]) element.classList.add('toggled')
    }
  });
  calculateScores()
}

const dataKeys = Array.from(document.querySelectorAll('[data-key]'))
applyDataKeysCache(localStorage.getItem('cache') ? JSON.parse(localStorage.getItem('cache')) : {})
document.querySelectorAll('.fence, .house, .pool, .park, .objective, .incrementable').forEach(element => {
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
    if (classes.contains('fence') || classes.contains('pool')) {
      placeToggleMenu(element)
    } else if (classes.contains('house') || classes.contains('objective')) {
      placeHouseMenu(element)
    } else {
      const alignment = classes.contains('park') ? 'horizontal' : 'vertical'
      placeIncrementableMenu({element, alignment})
    }
  })
});

document.addEventListener('click', event => {
  const isMenuOrHighlight = event.target.closest('.interact-menu') || event.target.closest('.highlight-box');
  if (!isMenuOrHighlight) hideAllMenus()
})

document.getElementById('refresh').addEventListener('click', () => clearDataKeys())
document.getElementById('city-name').addEventListener('keyup', () => cacheDataKeys())