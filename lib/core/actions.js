const {
  promisify
} = require('util')
const path = require('path')
const fs = require('fs')
const download = promisify(require('download-git-repo'))

const {
  projectRepo
} = require('../config/repo.config')
const {
  commandSpan
} = require('../utils/terminals')
const {
  compile,
  writeFile,
  changeToHump,
  changeToUpper
} = require('../utils/utils')

const createProjectAction = async (project) => {
  console.log('\x1B[36m zhang is helping you to clone the project, please wait~ \033[39m')

  // 1. clone 项目
  await download(projectRepo, project, {
    clone: true
  })

  // 2. 执行 npm install
  const command = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'
  await commandSpan(command, [], {
    cwd: `./${project}`
  })

  // 3. 执行 npm run start
  await commandSpan(command, ['start'], {
    cwd: `./${project}`
  })
}

const createComponentAction = async (componentName, dest) => {
  // 获取驼峰命名
  const humpComponentName = changeToHump(componentName)

  // 渲染模板
  const componentContent = await compile('component.ejs', {
    componentName: humpComponentName,
    styleWrapperName: humpComponentName + 'Wrapper',
    originName: componentName,
  })
  const indexContent = await compile('index.ejs', {
    componentName
  })
  const styleContent = await compile('component.style.ejs', {
    styleWrapperName: humpComponentName + 'Wrapper'
  })

  // 创建文件夹
  const outerDirPath = path.resolve(dest, componentName)
  if (fs.existsSync(outerDirPath)) {
    throw new Error('\x1B[31mthis component has esisted, please change the component name or delete the esisted component \033[39m')
  }
  fs.mkdirSync(outerDirPath)

  // 渲染文件
  const componentPath = path.resolve(outerDirPath, `${componentName}.component.tsx`)
  const indexPath = path.resolve(outerDirPath, 'index.ts')
  const stylePath = path.resolve(outerDirPath, `${componentName}.style.ts`)

  writeFile(componentPath, componentContent)
  writeFile(indexPath, indexContent)
  writeFile(stylePath, styleContent)
}

const createStore = async (pageName, dest) => {
  const humpPageName = changeToHump(pageName)

  // 生成 store 路径
  const storePath = path.resolve(dest, `${pageName}/store`)

  if (fs.existsSync(storePath)) {
    throw new Error('\x1B[31mthis store has esisted~ \033[39m')
  }
  // 创建 store 文件夹
  fs.mkdirSync(storePath)

  // 渲染模板
  const reducerContent = await compile('redux-reducer.ejs', {
    actionType: humpPageName + 'StoreAction',
    updateAction: `UPDATE_${changeToUpper(pageName)}_STORE`
  })
  const actionCreatorsContent = await compile('redux-actionCreators.ejs', {
    actionType: humpPageName + 'StoreAction',
    updateAction: `UPDATE_${changeToUpper(pageName)}_STORE`
  })
  const constantsContent = await compile('redux-constants.ejs', {
    updateAction: `UPDATE_${changeToUpper(pageName)}_STORE`
  })

  // // 生成文件
  const reducerPath = path.resolve(storePath, 'reducer.ts')
  const actionCreatorPath = path.resolve(storePath, 'actionCreators.ts')
  const constantsPath = path.resolve(storePath, 'constants.ts')

  writeFile(reducerPath, reducerContent)
  writeFile(actionCreatorPath, actionCreatorsContent)
  writeFile(constantsPath, constantsContent)
}

const createTypeFile = async (pageName) => {
  const typeName = `${pageName}.type.ts`
  const typePath = path.resolve(`./src/types/${typeName}`)

  const content = await compile('type.ejs', {
    type: `${changeToHump(pageName)}StoreType`
  })
  writeFile(typePath, content)
}

const createPageAction = async (pageName, dest) => {
  console.log(pageName)

  // 创建component
  await createComponentAction(pageName, dest)

  // 创建store
  createStore(pageName, dest)

  // 创建 type 文件
  createTypeFile(pageName, dest)

}

module.exports = {
  createProjectAction,
  createComponentAction,
  createPageAction
}