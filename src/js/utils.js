export const UTILS = {
  // Returns camelCase to Capitalize Case
  getFieldName: function (key) {
    const result = key.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
  },
  // Returns camelCase to kebab-case
  getFieldDataProperty: function (key) {
    return key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
  }
}
