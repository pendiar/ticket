const router = require('koa-router')()
const userinfoModel = require('../model/userinfo.js')
const title = '登录'

router.get('/login', async (ctx, next) => {
    await ctx.render('login', { title })
})

router.post('/login', async (ctx, next) => {
    const form = ctx.request.body

    const args = {
        username: form.username,
        password: form.password
    }

    let result = await userinfoModel.login(args);

    if (result && result.code === 0 && result.id != null) {
        ctx.session = { id: result.id }
    }

    ctx.body = { code: result.code }

})

module.exports = router