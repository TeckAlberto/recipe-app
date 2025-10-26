const lintCommand = 'pnpm eslint --fix'
const formatCommand = 'pnpm prettier --write'

export default {
  '*.{ts,tsx,js,jsx,vue}': [lintCommand, formatCommand],
  '*.{json,md,css,scss,html}': [formatCommand],
}
