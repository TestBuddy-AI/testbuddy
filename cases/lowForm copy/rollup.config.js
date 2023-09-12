import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const config = {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
  },
  plugins: [
    typescript(),
    nodeResolve(),
  ],
  external: [
    'react',
  ],
};

export default config;
