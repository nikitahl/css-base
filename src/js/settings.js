import fieldsSettings from './fieldsSettings.json'
import { UTILS } from './utils'

const settingsPanel = document.querySelector('.settings')

function createElement (tag, classNames, content) {
  const element = document.createElement(tag)
  element.classList.add(...classNames)
  if (content) {
    element.textContent = content
  }
  return element
}

function renderDropdownOptions (select, groups, selectedValue) {
  groups.forEach((group) => {
    const optgroup = document.createElement('optgroup')
    optgroup.setAttribute('label', group.name)
    group.values.forEach((value) => {
      const option = document.createElement('option')
      option.value = value.value
      option.textContent = value.name
      option.selected = value.value === selectedValue
      optgroup.appendChild(option)
    })
    select.appendChild(optgroup)
  })
}

function renderFields (body, settings) {
  const { sectionFields } = settings
  for (const key in sectionFields) {
    if (Object.prototype.hasOwnProperty.call(sectionFields, key)) {
      const element = fieldsSettings[key]
      const value = sectionFields[key]
      const label = createElement('label', ['option'], `${UTILS.getFieldName(key)}: `)
      let field = createElement(element.tag, ['field'])
      field.setAttribute('type', element.type)
      field.setAttribute('value', value)
      field.setAttribute('data-property', UTILS.getFieldDataProperty(key))
      field.setAttribute('data-raw-property', key)
      field.setAttribute('data-tag', settings.tag)
      if (element.type === 'dropdown') {
        const selectWrap = createElement('div', ['select-wrapper'])
        renderDropdownOptions(field, element.groups, value)
        selectWrap.appendChild(field)
        field = selectWrap
      }
      if (element.type === 'datalist') {
        field.setAttribute('type', 'text')
        field.setAttribute('list', element.tag + key)
        const datalist = createElement('datalist', ['datalist'])
        const datalistWrap = createElement('div', ['datalist-wrap'])
        datalist.setAttribute('id', element.tag + key)
        element.values.forEach((value) => {
          const option = document.createElement('option')
          option.value = value
          datalist.appendChild(option)
        })
        datalistWrap.appendChild(field)
        datalistWrap.appendChild(datalist)
        field = datalistWrap
      }
      label.appendChild(field)
      body.appendChild(label)
    }
  }
}

function clearSections () {
  if (settingsPanel.children.length) {
    var i = settingsPanel.childNodes.length
    while (i--) {
      settingsPanel.removeChild(settingsPanel.lastChild)
    }
  }
}

export default function initSettings () {
  clearSections()
  window.currentSectionsData.forEach((section, i) => {
    const wrapper = createElement('div', ['section'])
    if (section.settings && section.settings.tag) {
      wrapper.setAttribute('data-tag', section.settings.tag)
    }
    const headerClasses = ['section-header']
    if (i === 0) {
      headerClasses.push('active')
    }
    const header = createElement('div', headerClasses, section.title)
    const body = createElement('div', ['section-body'])
    renderFields(body, section.settings)
    wrapper.appendChild(header)
    wrapper.appendChild(body)
    settingsPanel.appendChild(wrapper)
  })
}
