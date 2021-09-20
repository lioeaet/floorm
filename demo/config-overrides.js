const { aliasDangerous } = require('react-app-rewire-alias/lib/aliasDangerous')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

const aliasMap = {
  '*': '../src'
}

module.exports = (config, env) => {
  const rules = config.module.rules[1]
  const scssUse = rules.oneOf.find(obj => String(obj.test) === String(/\.(scss|sass)$/)).use

  scssUse.splice(1, 0, {
    loader: require.resolve('astroturf/css-loader'),
    options: {
      sourceMap: env === 'production',
      modules: {
        getLocalIdent: getCSSModuleLocalIdent,
      },
    },
  })

  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    use: [{
      loader: 'astroturf/loader',
      options: { extension: '.module.scss' },
    }],
  })

  return aliasDangerous(aliasMap)(config)
}
