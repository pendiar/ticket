const router = require('koa-router')()
const userinfoModel = require('../model/userinfo.js')
const title = '注册'

router.get('/reg', async (ctx, next) => {
    await ctx.render('reg', { title })
})

router.post('/reg', async (ctx, next) => {

    const form = ctx.request.body

    const args = {
        username: form.username,
        password: form.password
    }
    const result = await userinfoModel.register(args)

    ctx.body = result;

})

module.exports = router