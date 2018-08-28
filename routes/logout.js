const router = require('koa-router')()

router.post('/logout', async (ctx, next) => {
  
  ctx.session = null

  let result = { code: 0 }

  ctx.body = result
  
})

module.exports = router