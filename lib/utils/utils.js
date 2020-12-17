const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

const compile = (fileName, data) => {
  const filePath = `../templates/${fileName}`
  const absPath = path.resolve(__dirname, filePath)
  return new Promise((resolve, reject) => {
    ejs.renderFile(absPath, {data}, {}, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
} 

const writeFile = (path, content) => {
  return fs.promises.writeFile(path, content)
}

// 转驼峰
const changeToHump = (name) => {
  const arr = name.split('-')
  if (arr.length > 1) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1)
    }
  } else {
    arr[0] = arr[0].slice(0, 1).toUpperCase() + arr[0].slice(1)
  }
  return arr.join('')
}

// 转大写
const changeToUpper = (name) => {
  return name.replace(/-/g, '_').toUpperCase()
}

module.exports = {
  compile,
  writeFile,
  changeToHump,
  changeToUpper
}