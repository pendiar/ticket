const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const session = require('koa-session');

const index = require('./routes/index')
const reg = require('./routes/reg')
const login = require('./routes/login')
const logout = require('./routes/logout')

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

app.keys = ['ticketdemo'];
const session_config = {
    key: 'ticketdemo',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true
}
  

app.use(session(session_config, app));

// routes
app.use(index.routes(), index.allowedMethods())
app.use(reg.routes(), reg.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(logout.routes(), logout.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(3000, () => {
  console.log('Start server at localhost:3000')
});

module.exports = app