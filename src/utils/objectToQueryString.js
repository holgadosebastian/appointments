export const objectToQueryString = object => {
  const paramsList = []

  for (const [key, value] of Object.entries(object)) {
    if (value && value !== "") paramsList.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  }

  if (paramsList.length > 0) return `?${paramsList.join("&")}`

  return ""
}
