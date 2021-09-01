'use strict'

const fs = require('fs');

if (process.argv.length < 4) {
  console.error('Wrong format. Usage: node ./extract.js <group> <key>');
  process.exit(1);
}

const group = process.argv[2];
const key = process.argv[3];

if (!group || !key) {
  console.error('Invalid group or key entered.')
  process.exit(1);
}

const rawData = fs.readFileSync('.fx/env.default.json');
const config = JSON.parse(rawData);

const candidate = config[group]?.[key];
if (!candidate) {
  console.error(`Cannot find the config by config[${group}][${key}].`);
  process.exit(1);
}

console.log(candidate);
