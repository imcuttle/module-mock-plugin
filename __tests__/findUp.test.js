const { sync } = require('../find-up')
const findUp = require('../find-up')
const { fixture } = require('./helper')
const fs = require('fs')

describe('findUp', function() {
  it('simple case', function() {
    // context, path, request
    expect(
      sync('module', {
        fs,
        dir: fixture('')
      })
    ).toMatchObject({
      dir: fixture(''),
      path: fixture('module')
    })
  })

  it('deep case', function() {
    // context, path, request
    expect(
      sync('find-me', {
        fs,
        dir: fixture('find-up/src/x')
      })
    ).toMatchObject({
      dir: fixture('find-up/src'),
      path: fixture('find-up/src/find-me')
    })
  })

  it('deep case `allowFile: false`', function() {
    // context, path, request
    expect(
      sync('find-me', {
        fs,
        dir: fixture('find-up/src/x'),
        allowFile: false
      })
    ).toMatchObject({
      dir: fixture('find-up'),
      path: fixture('find-up/find-me')
    })
  })

  it('not found', function() {
    // context, path, request
    expect(
      sync('_____not___found____', {
        fs,
        dir: fixture('')
      })
    ).toMatchObject({
      dir: '/',
      path: null
    })
  })
})

describe('findUp Callback', function() {
  it('simple case', function(done) {
    // context, path, request
    findUp(
      'module',
      {
        fs,
        dir: fixture('')
      },
      (error, data) => {
        expect(data).toMatchObject({
          dir: fixture(''),
          path: fixture('module')
        })
        done(error)
      }
    )
  })

  it('deep case', function(done) {
    // context, path, request
    findUp(
      'find-me',
      {
        fs,
        dir: fixture('find-up/src/x')
      },
      (error, data) => {
        expect(data).toMatchObject({
          dir: fixture('find-up/src'),
          path: fixture('find-up/src/find-me')
        })
        done(error)
      }
    )
  })

  it('deep case `allowFile: false`', function(done) {
    // context, path, request
    findUp(
      'find-me',
      {
        fs,
        dir: fixture('find-up/src/x'),
        allowFile: false
      },
      (err, data) => {
        expect(data).toMatchObject({
          dir: fixture('find-up'),
          path: fixture('find-up/find-me')
        })
        done(err)
      }
    )
  })

  it('not found', function(done) {
    // context, path, request
    findUp(
      '_____not___found____',
      {
        fs,
        dir: fixture('')
      },
      (err, data) => {
        expect(data).toMatchObject({
          dir: '/',
          path: null
        })
        done(err)
      }
    )
  })
})
