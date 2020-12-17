const program = require('commander')

const helpOptionsInit = () => {
  // 配置options
  program.option('-d --dest <dest>', 'choose your project dest folder')
  program.option('-f --framework <framework>', 'choose ur framework, such as: -f vue')

  program.on('--help', () => {
    console.log('')
    console.log('other options')
    console.log('options1: ')
  })
}

module.exports = helpOptionsInit