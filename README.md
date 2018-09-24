# @beaker/datignore

A module for reading and using .datignore files.

```js
const datignore = require('@beaker/datignore')
const anymatch = require('anymatch')

// convert a .datignore to rules that can be fed into anymatch()
const rules = datignore.toAnymatchRules(`
  .git
  .dat
  node_modules
  *.log
`)
anymatch(rules, ...)
```