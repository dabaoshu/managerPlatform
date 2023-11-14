import type { MonacoEditorProps } from 'react-monaco-editor';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';
console.log(monaco.languages.getLanguages());

export function SqlEditor(props: MonacoEditorProps) {
  const { options = {}, ...rest } = props;
  return (
    <MonacoEditor
      theme="vs-dark"
      height={300}
      language="sql"
      options={{
        automaticLayout: true,
        lineDecorationsWidth: 4,
        fontSize: 12,
        selectOnLineNumbers: true,
        wordWrapColumn: 70, // 一行多少字符
        wordWrap: 'wordWrapColumn', // 一行文字超出，是否换行
        minimap: {
          enabled: true, // 是否启用小地图的渲染
        },
        ...options,
      }}
      {...rest}
    />
  );
}

monaco.languages.registerCompletionItemProvider('sql', {
  provideCompletionItems: (model, position) => {
    const suggestions = [];
    const { lineNumber, column } = position;
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column,
    });
    const contents = textBeforePointer.trim().split(/\s+/);
    const lastContents = contents[contents?.length - 1]; // 获取最后一段非空字符串
    if (lastContents) {
      const keywords = [...sqlLanguage.keywords];
      const sqlConfigKey = [
        { key: 'operators', type: monaco.languages.CompletionItemKind.Operator },
        { key: 'builtinFunctions', type: monaco.languages.CompletionItemKind.Function },
      ];
      const codeSet = new Set();
      sqlConfigKey.forEach(({ key, type }) => {
        sqlLanguage[key].forEach((sql) => {
          codeSet.add(sql);
          suggestions.push({
            label: sql, // 显示的提示内容;默认情况下，这也是选择完成时插入的文本。
            insertText: sql, // 选择此完成时应插入到文档中的字符串或片段
            kind: type,
          });
        });
      });
      keywords.forEach((word) => {
        if (!codeSet.has(word)) {
          suggestions.push({
            label: word, // 显示的提示内容;默认情况下，这也是选择完成时插入的文本。
            insertText: word, // 选择此完成时应插入到文档中的字符串或片段
            kind: monaco.languages.CompletionItemKind.Keyword,
          });
        }
      });
    }
    return {
      suggestions,
    };
  },
});
