import fs from 'node:fs'
import path from 'node:path'

const lcovPath = path.resolve('coverage/lcov.info')

if (fs.existsSync(lcovPath)) {
  const lcov = fs.readFileSync(lcovPath, 'utf8')
  fs.writeFileSync(lcovPath, lcov.replaceAll('\\', '/'))
}
