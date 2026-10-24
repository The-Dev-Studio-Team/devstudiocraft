// Native SVG cursor family: rewrites every `cursor:` keyword to its --dsc-cursor-* token (tools/cursors/).
module.exports = {
  plugins: [require('./tools/cursors/postcss-plugin.cjs')],
};
