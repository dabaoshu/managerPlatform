const textFormats = {
  txt: 'text/plain',
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  csv: 'text/csv',
  md: 'text/markdown',
  yaml: 'application/x-yaml',
  log: 'text/plain',
  config: 'text/plain',
  ini: 'text/plain',
  rtf: 'application/rtf',
  tsv: 'text/tab-separated-values',
};

export class FileDownloader {
  textFormats: Record<string, string>
  constructor(options) {
    this.textFormats = { ...textFormats, ...(options.textFormats || {}) }
  }

  download(data, filename, fileExtension = 'text') {
    const fileType = textFormats[fileExtension];
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename || 'download';

    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  }
}

export default new FileDownloader({})