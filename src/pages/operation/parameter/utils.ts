
export const generateList = (data, name = []) => {
  const list = data.map(o => {
    const { field_type, field_name } = o
    const form_field_name = [...name, field_name]
    /**只有这三个是有children的 */
    if (["array-object", "object"].includes(field_type) && field_name) {
      return {
        form_field_name,
        key: form_field_name.join('_'),
        ...o,
        children: generateList(o.children, form_field_name)
      }
    } else if ('array-string'.includes(field_type) && field_name) {
      return {
        form_field_name,
        key: form_field_name.join('_'),
        ...o,
      }
    } else {
      return {
        form_field_name,
        key: form_field_name.join('_'),
        ...o,
      }
    }
  })
  return list
}

export const generateListEditKey = (data, key,) => {
  const list = []

  data.forEach(element => {
    list.push(element[key])
    if (element.children && element.children.length > 0) {
      list.push(...generateListEditKey(element.children, key))
    }
  });
  return list
}