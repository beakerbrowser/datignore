const path = require('path')

exports.toAnymatchRules = function (str) {
  if (!str || typeof str !== 'string') {
    str = ''
  }

  return str.split('\n')
    .filter(Boolean)
    .map(rule => {
      if (!rule.startsWith('/')) {
        rule = '**/' + rule
      }
      rule = rule.replace(/\r/g, '') // strip windows \r newlines
      return rule
    })
    .concat(['/.git', '/.dat']) // always include .git and .dat
    .map(path.normalize)
}