const nps = require('path')

function findUp(name, { dir, fs, allowFile = true, allowDirectory = true, ignoreSelfPath = false } = {}, cb) {
  const isValid = (path, cb) => {
    if (ignoreSelfPath && path.startsWith(dir)) {
      return cb(null, false)
    }

    fs.stat(path, (err, stat) => {
      if (err) {
        cb(err)
      } else {
        if (allowDirectory && stat.isDirectory()) {
          return cb(null, true)
        }
        if (allowFile && stat.isFile()) {
          return cb(null, true)
        }
        return cb(null, false)
      }
    })
  }

  fs.readdir(dir, (err, names) => {
    if (err) {
      return cb(err)
    }

    if (names.includes(name)) {
      const path = nps.join(dir, name)
      isValid(path, (err, valid) => {
        if (err) {
          return cb(err)
        }

        if (valid) {
          return cb(null, {
            dir,
            path
          })
        }

        const parent = nps.dirname(dir)
        if (parent === dir) {
          return cb(null, {
            dir,
            path: null
          })
        }

        return findUp(name, { fs, dir: parent, allowFile, allowDirectory }, cb)
      })
    } else {
      const parent = nps.dirname(dir)
      if (parent === dir) {
        return cb(null, {
          dir,
          path: null
        })
      }

      return findUp(name, { fs, dir: parent, allowFile, allowDirectory, ignoreSelfPath }, cb)
    }
  })
}

function findUpSync(name, { dir, fs, allowFile = true, allowDirectory = true } = {}) {
  const isValid = path => {
    const stat = fs.statSync(path)
    if (allowDirectory && stat.isDirectory()) {
      return true
    }
    if (allowFile && stat.isFile()) {
      return true
    }
    return false
  }

  const names = fs.readdirSync(dir)
  if (names.includes(name)) {
    const path = nps.join(dir, name)
    if (isValid(path)) {
      return {
        dir,
        path
      }
    }
  }

  const parent = nps.dirname(dir)
  if (parent === dir) {
    return {
      dir,
      path: null
    }
  }

  return findUpSync(name, { fs, dir: parent, allowFile, allowDirectory })
}

module.exports = findUp
module.exports.sync = findUpSync
