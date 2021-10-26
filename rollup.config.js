import path from 'path'
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser'
import alias from 'rollup-plugin-alias'

export default {
  input: 'src/index.js',
  output: {
    file: 'floorm.min.js',
    format: 'cjs',
    name: 'floorm',
    globals: {
      react: 'React'
    }
  },
  plugins: [
    babel(),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
    alias({
      resolve: ['.js'],
      entries: {
        '*': path.resolve(__dirname, 'src')
      }
    }),
  ],
  external: ['react']
}
