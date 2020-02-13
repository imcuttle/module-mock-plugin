/**
 * The plugin on enhanced-resolver for easy mock
 * @author imcuttle
 */
const findUp = require('./find-up')
const resolve = require('resolve')
const nps = require('path')
const AbsoluteModuleMapperPlugin = require('absolute-module-mapper-plugin')

const createLog = fn => (...argvs) => fn('module-mock-plugin:', ...argvs)
const logger = {
  error: createLog(console.error.bind(console, 'Error'))
}

const createRequestMapper = (opts, resolver) => {
  if (nps.isAbsolute(opts.mockFilePath)) return (request, context) => {}
  else {
    return (request, { context = {}, ...rest } = {}, cb) => {
      const issuer = context.issuer

      // console.error(request, context, rest)

      if (nps.isAbsolute(request) || request.trim().startsWith('./')) {
        return cb(null, request)
      }

      if (!issuer || context.moduleMockPlugin) {
        return cb(null, request)
      }

      findUp(
        opts.mockFilePath,
        {
          dir: nps.dirname(issuer),
          fs: resolver.fileSystem,
          allowFile: false,
          ignoreSelfPath: true
        },
        (error, { path } = {}) => {
          if (error) {
            !opts.silent && logger.error(error)
            return cb(null, request)
          } else {
            if (!path) {
              !opts.silent && logger.error(`The nearest folder was not found which named '${opts.mockFilePath}'`)
              return cb(null, request)
            }

            // const newContext = { moduleMockPlugin: true }
            resolver.resolve({...context, moduleMockPlugin: true}, path, './' + request, {}, (error, resolvedPath) => {
              if (error) {
                !opts.silent && logger.error(error)
                return cb(null, request)
              } else {
                return cb(null, resolvedPath || request)
              }
            })
          }
        }
      )
    }
  }
}

const normalizeOptions = (options, resolver) => {
  options = Object.assign({}, options, {
    mockFilePath: '__mocks__'
  })

  if (!options.requestMapper && options.mockFilePath) {
    options.requestMapper = createRequestMapper(options, resolver)
  }

  return options
}

class ModuleMockPlugin extends AbsoluteModuleMapperPlugin {
  constructor(opts) {
    super(opts)
  }

  apply(resolver) {
    if (!this.optionsNormalized) {
      this.options = normalizeOptions(this.options, resolver)
    }
    this.optionsNormalized = true

    return super.apply(resolver)
  }
}

module.exports = ModuleMockPlugin
