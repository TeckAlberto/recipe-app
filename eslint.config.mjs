import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
// import tailwindcss from "eslint-plugin-tailwindcss"; // comentar hasta que haya soporte para Tailwind 4

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // plugins: {
    //   tailwindcss,
    // },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'double'],
      // "tailwindcss/classnames-order": "off",
      // "tailwindcss/no-custom-classname": "warn",
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
