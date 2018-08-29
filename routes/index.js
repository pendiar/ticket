const router = require('koa-router')()
const userinfoModel = require('../model/userinfo')
const ticketModel = require('../model/ticket')
const title = '首页'

router.get('/', async (ctx, next) => {
    if (!ctx.session || ctx.session.id == null) {
        await ctx.redirect('/login')
    } else {
        const id = ctx.session.id
        const userinfo = await userinfoModel.getById(id)
        const allSeats = await ticketModel.getAllSeats()
        const areas = []
        const map = {}
        allSeats.sort((a, b) => {
            if (a.area !== b.area) {
                return a.area > b.area ? 1 : -1
            } else if (a.row !== b.row) {
                return a.row - b.row
            } else {
                return a.col - b.col
            }
        }).forEach(seat => {
            let area = map['area' + seat.area]
            if (!area) {
                area = { area: seat.area, rows: [] }
                map['area' + seat.area] = area
                areas.push(area)
            }
            let row = map[seat.area + 'row' + seat.row]
            if (!row) {
                row = { row: seat.row, cols: [] }
                map[seat.area + 'row' + seat.row] = row
                area.rows.push(row)
            }
            row.cols.push(seat)
        })
        const sets = await ticketModel.getSetByUserName(userinfo || {})
        const updateTime = sets[0] && sets[0].updateTime
        let time = 0
        if (updateTime) {
            time = 30 * 60 - Math.ceil((Date.now() - updateTime) / 1000)
        }
        await ctx.render('index', { title, username: userinfo && userinfo.username, areas, sets: sets.map(seat => `${seat.area}-${seat.row}-${seat.col}`).join(), time })
    }
})

router.post('/', async (ctx, next) => {
    if (!ctx.session || ctx.session.id == null) {
        await ctx.redirect('/login')
    } else {
        const form = ctx.request.body
        const id = ctx.session.id
        const userinfo = await userinfoModel.getById(id)

        if (form.type === 'set') {
            const sRet = await ticketModel.set({ username: userinfo && userinfo.username, num: form.num })
    
            ctx.body = sRet
        } else if (form.type === 'buy') {
            const bRet = await ticketModel.buy({ username: userinfo && userinfo.username })
            ctx.body = bRet
        } else {
            ctx.body = { code: -5, msg: 'typw error' }
        }
    }
})

module.exports = router
