'use strict'

const fs = require('fs')

const group = process.argv[2];
const key = process.argv[3];

if (!key) {
  process.exit(1);
}

let rawData = fs.readFileSync('.fx/env.default.json')
let config = JSON.parse(rawData)

console.log(config[group][key])
