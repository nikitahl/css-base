import sectionsData from './sectionsData.json'

import initSettings from './settings'
import { initStorage, handleStorageControlClick } from './storage'
import { initCodeData, handleCopyToClipboardClick } from './code'

const aside = document.querySelector('.aside')
const form = aside.querySelector('.settings')
const main = document.querySelector('.main')
const toggleAside = document.querySelector('.mobile-view-toggle')
// const outputControl = document.querySelector('.output-control')

window.currentSectionsData = Object.assign(sectionsData, {})
window.isFormTouched = true
window.initialLoad = true
window.isLoadFromStorage = false

function applySettings () {
  const fields = Array.from(aside.querySelectorAll('.field'))
  fields.forEach((field) => {
    upateDOMElement(field)
  })
  if (window.initialLoad) {
    window.initialLoad = false
  }
  if (window.isLoadFromStorage) {
    window.isLoadFromStorage = false
  }
}

function upateDOMElement (element) {
  const { tag } = element.closest('.section').dataset
  let value = element.value
  // Need to set empty string, for color input
  if (window.initialLoad || window.isLoadFromStorage) {
    value = element.getAttribute('value')
  }
  if (tag === 'body') {
    document.body.style[element.dataset.property] = value
  } else {
    const domElements = Array.from(main.querySelectorAll(tag))
    domElements.forEach(node => { node.style[element.dataset.property] = value })
  }
  const sectionIndex = window.currentSectionsData.findIndex(section => tag === section.settings.tag)
  window.currentSectionsData[sectionIndex].settings.sectionFields[element.dataset.rawProperty] = value
  window.isFormTouched = true
}

function handleFormChange (e) {
  upateDOMElement(e.target)
}

function handleAsideClick (e) {
  if (e.target.classList.contains('tab')) {
    if (e.target.dataset.type === 'code') {
      initCodeData()
    } else {
      window.isFormTouched = false
    }
    aside.setAttribute('data-active-panel', e.target.dataset.type)
  }
  if (e.target.classList.contains('section-header')) {
    e.target.classList.toggle('active')
  }
  if (e.target.classList.contains('storage-control')) {
    handleStorageControlClick(e.target)
  }
  if (e.target.classList.contains('copy-to-clipboard')) {
    handleCopyToClipboardClick(e.target)
  }
}

function handleToggleClick (e) {
  toggleAside.classList.toggle('collapse')
  aside.classList.toggle('collapse')
}

window.rebuildSidebar = initSettings
window.updateElements = applySettings

initSettings()
initStorage()
applySettings()

form.addEventListener('change', handleFormChange)
aside.addEventListener('click', handleAsideClick)
toggleAside.addEventListener('click', handleToggleClick)
