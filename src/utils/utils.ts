export const getTitleByType = (type, name = '', titleType = {}) => {
  const titleTypeMap = {
    add: "添加",
    edit: "编辑",
    view: '查看',
    ...titleType
  }
  const title = titleTypeMap[type] || ""

  return `${title}${name}`
}
export function getLabelInArray(
  datasource = [],
  value,
  labelField = 'label',
  valueField = 'value'
) {
  const obj = datasource.find(o => o[valueField] === value) || {};
  return obj[labelField] || '';
}

// APS - 6aqoJ9dblCS1SNlTg0a4403aUzVhYmdr