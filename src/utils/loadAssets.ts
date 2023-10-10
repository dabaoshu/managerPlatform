export function loadAssets(url) {
  if (process.env.NODE_ENV === 'development') {
    return `${PUBLIC_PATH}${url}`;
  }

  return `${PUBLIC_PATH}${url}`;
}