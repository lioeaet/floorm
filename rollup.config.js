import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'react-norm.min.js',
    format: 'cjs',
    name: 'react-norm',
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
  ],
  external: ['react']
}
