/**
 * The plugin on enhanced-resolver for easy mock
 * @author imcuttle
 */
const nps = require('path')
const AbsoluteModuleMapperPlugin = require('absolute-module-mapper-plugin')

const findUp = require('./find-up')

const createLog = fn => (...argvs) => fn('module-mock-plugin:', ...argvs)
const logger = {
  error: createLog(console.error.bind(console, 'Error'))
}

const createRequestMapper = (opts, resolver) => {
  return (request, { context = {}, ...rest } = {}, cb) => {
    const issuer = context.issuer

    if (nps.isAbsolute(request) || request.trim().startsWith('./') || request.trim().startsWith('..')) {
      return cb(null, request)
    }

    if (!issuer || context.moduleMockPlugin) {
      return cb(null, request)
    }

    if (nps.isAbsolute(opts.mockFilePath)) {
      if (issuer.startsWith(opts.mockFilePath)) {
        return cb(null, request)
      }
      return resolver.resolve(
        { ...context, moduleMockPlugin: true },
        opts.mockFilePath,
        './' + request,
        {},
        (error, resolvedPath) => {
          if (error) {
            return cb(null, request)
          } else {
            return cb(null, resolvedPath || request)
          }
        }
      )
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
          return cb(null, request)
        } else {
          if (!path) {
            return cb(null, request)
          }

          resolver.resolve({ ...context, moduleMockPlugin: true }, path, './' + request, {}, (error, resolvedPath) => {
            if (error) {
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

const normalizeOptions = (options, resolver) => {
  if (!options.requestMapper && options.mockFilePath) {
    options.requestMapper = createRequestMapper(options, resolver)
  }

  return options
}

class ModuleMockPlugin extends AbsoluteModuleMapperPlugin {
  constructor(opts) {
    super(
      Object.assign(
        {
          include: [/^((?!\/node_modules\/).)*$/],
          mockFilePath: '__mocks'
        },
        opts
      )
    )
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
