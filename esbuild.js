async function start() {
  await require('esbuild').build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV === 'development',
    mainFields: ['module', 'main'],
    external: ['coc.nvim', 'typescript'],
    platform: 'node',
    target: 'node14.12',
    outfile: 'lib/index.js'
  })
}

start().catch(e => {
  console.error(e)
})
