import { UTILS } from './utils'

const codePanel = document.querySelector('.code')
const readyStyles = codePanel.querySelector('.ready-styles')
const sourceCode = codePanel.querySelector('.source-code')
const code = {}
let textValue = ''
let styles = ''

function getPropertiesCodeString (props, isSourceText = false) {
  let properties = ''
  const keys = Object.keys(props)
  keys.forEach((prop, i) => {
    const propName = UTILS.getFieldDataProperty(prop)
    let value = ''
    if (isSourceText) {
      value = `${propName}: ${props[prop]};`
    } else {
      value = `<code class="style-property">${propName}</code>: <code class="style-value">${props[prop]}</code>;`
    }
    if (i < keys.length - 1) {
      properties += `${value}
  `
    } else {
      properties += `${value}`
    }
  })
  return properties
}

function generateCodeString () {
  Object.keys(code).forEach((key) => {
    const properties = code[key]
    if (Object.keys(properties).length) {
      styles += `<code class="style-selector">${key}</code> {
  ${getPropertiesCodeString(properties, false)}
}

`
      textValue += `${key} {
  ${getPropertiesCodeString(properties, true)}
}

`
    }
  })
}

function populateCodeData () {
  window.currentSectionsData.forEach((section) => {
    if (section.settings && section.settings.tag) {
      if (section.settings.tag in code === false) {
        code[section.settings.tag] = {}
      }
      const sectionFields = section.settings && section.settings.sectionFields
      Object.keys(sectionFields).forEach((field) => {
        if (sectionFields[field]) {
          code[section.settings.tag][field] = sectionFields[field]
        }
      })
    }
  })
}

export function handleCopyToClipboardClick () {
  sourceCode.focus()
  sourceCode.select()
  const isSuccessful = document.execCommand('copy')

  if (!isSuccessful) {
    console.error('Failed to copy text.')
  }
}

export function initCodeData () {
  if (window.isFormTouched) {
    styles = ''
    textValue = ''
    populateCodeData()
    generateCodeString()
    readyStyles.innerHTML = styles
    sourceCode.value = textValue
  }
}
