const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '..', 'dist', 'assets');
const newModel = process.env.NEW_GROQ_MODEL || 'llama-3.1-8b-instant';
const unsupportedModelPattern = /llama-3\.(1|3)-70b-(versatile|instant)/g;

fs.readdirSync(file).forEach(f => {
  const p = path.join(file, f);
  if (/index-.*\.js$/.test(f)) {
    let s = fs.readFileSync(p, 'utf8');
    if (unsupportedModelPattern.test(s)) {
      unsupportedModelPattern.lastIndex = 0;
      s = s.replace(unsupportedModelPattern, newModel);
      fs.writeFileSync(p, s, 'utf8');
      console.log('Patched', p);
    } else {
      console.log('No occurrence in', p);
    }
  }
});
