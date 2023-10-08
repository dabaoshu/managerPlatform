module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/stylelint')],
  rules: {
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
  },
};
