const datignore = require('./index')
const test = require('ava')
const anymatch = require('anymatch')

const TEST_PATHS = [
  '/foo.txt',
  '/bar.txt',
  '/baz.txt',
  '/.git',
  '/.dat',
  '/sub/foo.txt',
  '/sub/bar.txt',
  '/sub/baz.txt'
]

test('Default rules for empty string', t => {
  t.deepEqual(datignore.toAnymatchRules(''), ['/.git', '/.dat'])
})

test('Default rules for bad params', t => {
  t.deepEqual(datignore.toAnymatchRules(), ['/.git', '/.dat'])
  t.deepEqual(datignore.toAnymatchRules(false), ['/.git', '/.dat'])
})

test('One rule', t => {
  t.deepEqual(datignore.toAnymatchRules('/foo.txt'), ['/foo.txt', '/.git', '/.dat'])
  runAnymatches(t, '/foo.txt', ['/foo.txt', '/.git', '/.dat'])
})

test('Two rules', t => {
  t.deepEqual(datignore.toAnymatchRules('/foo.txt\n/bar.txt'), ['/foo.txt', '/bar.txt', '/.git', '/.dat'])
  runAnymatches(t, '/foo.txt\n/bar.txt', ['/foo.txt', '/bar.txt', '/.git', '/.dat'])
})

test('Empty newlines are ignored', t => {
  t.deepEqual(datignore.toAnymatchRules('/foo.txt\n\n\n\n/bar.txt\n'), ['/foo.txt', '/bar.txt', '/.git', '/.dat'])
})

test('Carraige returns are ignored', t => {
  t.deepEqual(datignore.toAnymatchRules('/foo.txt\r\n/bar.txt\r\n'), ['/foo.txt', '/bar.txt', '/.git', '/.dat'])
})

test('Rules without a preceding slash are given syntax to match anywhere in the folders', t => {
  t.deepEqual(datignore.toAnymatchRules('foo.txt\nbar.txt'), ['**/foo.txt', '**/bar.txt', '/.git', '/.dat'])
  runAnymatches(t, 'foo.txt\nbar.txt', ['/foo.txt', '/bar.txt', '/.git', '/.dat', '/sub/foo.txt', '/sub/bar.txt'])
})

function runAnymatches (t, str, matches) {
  var rules = datignore.toAnymatchRules(str)
  for (let p of TEST_PATHS) {
    if (anymatch(rules, p)) {
      if (!matches.includes(p)) {
        t.fail(`${p} should not have matched ${str}`)
      }
    } else {
      if (matches.includes(p)) {
        t.fail(`${p} should have matched ${str}`)
      }      
    }
  }
}