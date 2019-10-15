const loadModal = document.querySelector('.load-modal')
const loadItems = loadModal.querySelector('.load-items')

let storageChanged = true

function renderEntry (configName, currentDate) {
  const entry = document.createElement('li')
  entry.classList.add('saved-item')
  entry.dataset.itemName = configName
  entry.innerHTML = `${configName} [${currentDate}] <button class="delete-saved-item">Delete</button>`
  loadItems.appendChild(entry)
}

function save () {
  const configName = window.prompt('Enter the name of config:')
  if (configName) {
    const currentDate = new Date().toLocaleString()
    const savedData = { date: currentDate, data: window.currentSectionsData }
    if (!storageChanged) {
      if (!window.localStorage.length) {
        loadItems.innerHTML = ''
      }
      renderEntry(configName, currentDate)
    }

    window.localStorage.setItem(configName, JSON.stringify(savedData))
  }
}

function load () {
  if (storageChanged) {
    if (window.localStorage.length) {
      loadItems.innerHTML = ''
      for (const key in window.localStorage) {
        if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
          const element = JSON.parse(window.localStorage[key])
          renderEntry(key, element.date)
        }
      }
    } else {
      loadItems.innerHTML = '<p class="empty-storage">No saved items</p>'
    }

    storageChanged = false
  }
  loadModal.style.display = 'block'
}

function handleModalClick (e) {
  if (e.target.classList.contains('close-modal')) {
    loadModal.style = ''
  }
  if (e.target.classList.contains('saved-item')) {
    const { itemName } = e.target.dataset
    const { data } = JSON.parse(window.localStorage.getItem(itemName))
    window.currentSectionsData = data
    window.isFormTouched = true
    window.isLoadFromStorage = true
    window.rebuildSidebar()
    window.updateElements()
  }
  if (e.target.classList.contains('delete-saved-item')) {
    const item = e.target.closest('.saved-item')
    window.localStorage.removeItem(item.dataset.itemName)
    item.remove()
    if (!window.localStorage.length) {
      loadItems.innerHTML = '<p class="empty-storage">No saved items</p>'
    }
  }
}

export function handleStorageControlClick (target) {
  if (target.dataset.action === 'save') {
    save()
  } else {
    load()
  }
}

export function initStorage (target) {
  loadModal.addEventListener('click', handleModalClick)
}
