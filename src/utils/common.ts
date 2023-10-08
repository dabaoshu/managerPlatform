export const getQueryStr = (name: string) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r =
    window.location.search.substr(1).match(reg) ||
    window.location.hash.substring(window.location.hash.search(/\?/) + 1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};
