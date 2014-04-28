// from normalize-package-data/lib/fixer.js
function validName (name) {
  var parts = name.split('/')
    , user = parts[0]
    , repo = parts[1]

  for (i = 0; i < 2; i++) {
    if (parts[i].charAt(0) === '.' ||
        parts[i].match(/[\/@\s\+%:]/) ||
        parts[i] !== encodeURIComponent(parts[i]) ||
        parts[i].toLowerCase() === 'node_modules' ||
        parts[i].toLowerCase() === 'favicon.ico') {
          return false
    }
  }
  return parts.length == 2 || parts.length == 1;
}

module.exports = validName
