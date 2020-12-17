const program = require('commander')

const {
  createProjectAction,
  createComponentAction,
  createPageAction
} = require('./actions')

const createCommandsInit = () => {
  program
    .command('create <project> [others...]')
    .description('clone a preject into the floder')
    .action(createProjectAction)
   
  program
    .command('addCpn <name>')
    .description('add a react common component')
    .action((name) => {
      createComponentAction(name, program.dest || 'src/components')
    })

  program
    .command('addPage <name>')
    .description('add a react common page')
    .action((name) => {
      createPageAction(name, program.dest || 'src/pages')
    })
}

module.exports = createCommandsInit