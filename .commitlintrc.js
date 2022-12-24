const fs = require('fs')
const path = require('path')
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'))
module.exports = {
  prompt: {
    scopes: [...packages]
  }
}
