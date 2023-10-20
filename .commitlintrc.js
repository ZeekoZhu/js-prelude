const fs = require('fs');
const path = require('path');
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));
const apps = fs.readdirSync(path.resolve(__dirname, 'apps'));
module.exports = {
  prompt: {
    scopes: [...packages, ...apps],
  },
};
