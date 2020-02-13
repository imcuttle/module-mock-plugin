const Plugin = require('../')
const { fixture } = require('./helper')
const resolve = require('enhanced-resolve')
const fs = require('fs')
const { ResolverFactory, CachedInputFileSystem, NodeJsInputFileSystem } = resolve

const resolverOptions = () => {
  return {
    useSyncFileSystemCalls: true,
    fileSystem: new CachedInputFileSystem(fs, 4000),
    extensions: ['.js', '.json']
  }
}

const sync = resolve.create.sync({
  ...resolverOptions(),
  plugins: [
    new Plugin({
      root: fixture(''),
      silent: false
    })
  ]
})

const async = resolve.create({
  ...resolverOptions(),
  useSyncFileSystemCalls: false,
  plugins: [
    new Plugin({
      root: fixture(''),
      silent: false
    })
  ]
})

// console.error(sync({}, process.cwd(), './find-up.js'))
// console.error(sync({}, fixture('__mocks__'), './react.js'))

describe('module-mock-plugin', function() {
  it('simple case', function() {
    // context, path, request
    expect(
      sync(
        {
          issuer: fixture('module/a.js')
        },
        '',
        'react'
      )
    ).toBe(fixture('__mocks__/react.js'))
  })

  it('simple case async', function(done) {
    // context, path, request
    async(
      {
        issuer: fixture('module/a.js')
      },
      '',
      'react',
      {},
      (e, result) => {
        expect(result).toBe(fixture('__mocks__/react.js'))
        done(e)
      }
    )
  })

  it('should nest throw', function() {
    // context, path, request
    expect(() =>
      sync(
        {
          issuer: fixture('module/__mocks__/mobx/index.js')
        },
        '',
        'mobx'
      )
    ).toThrowErrorMatchingInlineSnapshot(`"Can't resolve 'mobx' in ''"`)
  })

  it('should nest', function() {
    // context, path, request
    expect(
      sync(
        {
          issuer: fixture('module/__mocks__/prop-types/index.js')
        },
        '',
        'prop-types'
      )
    ).toBe(fixture('__mocks__/prop-types/index.js'))
  })
})
