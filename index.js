#!/usr/bin/env node
const program = require('commander')

const helpOptionsInit = require('./lib/core/help')
const createCommandsInit = require('./lib/core/commands')

program.version(require('./package.json').version)

helpOptionsInit()
createCommandsInit()

program.parse(process.argv)

// console.log(program.framework)
