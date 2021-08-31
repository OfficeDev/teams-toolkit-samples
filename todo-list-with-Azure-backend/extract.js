'use strict'

const fs = require('fs');

if (process.argv.length < 4) {
  console.log('Wrong format. Usage: node ./extract.js <group> <key>');
  process.exit(1);
}

const group = process.argv[2];
const key = process.argv[3];

if (!group || !key) {
  console.log('Invalid group or key entered.')
  process.exit(1);
}

const rawData = fs.readFileSync('.fx/env.default.json');
const config = JSON.parse(rawData);

const candidate = config[group]?.[key];
if (!candidate) {
  console.log(`Cannot find the config by config[${group}][${key}].`);
  process.exit(1);
}

console.log(candidate);
