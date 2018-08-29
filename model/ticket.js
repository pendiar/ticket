const areas = ['A', 'B', 'C', 'D']
const firstRow = 50
const add = 2
const lastRow = 100

const rownum = (lastRow - firstRow) / add + 1
const allSeats = []
areas.forEach(area => {
    for (let i = 0; i < rownum; i++) {
        const num = firstRow + add * i
        for (let j = 0; j < num; j++) {
            allSeats.push({
                area: area,
                row: i,
                col: j,
                set: null,
                buy: null,
                updateTime: Date.now()
            })
        }
    }
})

function setSeats (wholeSeats, num, rowSeats) {
    const seats = rowSeats && rowSeats.length ? rowSeats : wholeSeats
    let r = Math.floor(Math.random() * seats.length)
    const arr = seats.slice(r).concat(seats.slice(0, r))
    let sseats = []
    let oseats = []
    arr.forEach(seat => {
        const l = sseats.length
        if (l >= num) return
        var lseat = sseats[l - 1]
        if (lseat && seat.row === lseat.row && seat.col === lseat.col + 1) {
            sseats.push(seat)
        } else {
            if (l > oseats.length) oseats = sseats
            sseats = [seat]
        }
    })
    if (sseats.length >= num) {
        return sseats
    } else {
        oseats.forEach(seat => {
            seat.set = true
        })
        const nseats = wholeSeats.filter(seat => !seat.set && !seat.buy)
        const nRowSeats = seats.filter(seat => !seat.set && !seat.buy && seat.area === oseats[0].area && seat.row === oseats[0].row)
        return oseats.concat(setSeats(nseats, num - oseats.length, nRowSeats))
    }
}

const ticket = {
    async set ({username, num}) {
        num = +num
        if (!username || !num) {
            return { code: -1, msg: '输入错误' }
        }
        const bought = await this.getBuyByUserName({username})
        if (bought.length + num > 5) {
            return { code: -2, msg: '你购买的数量超过上限' }
        }
        const enable = allSeats.filter(seat => seat.set == null && seat.buy == null)
        const sseats = setSeats(enable, num)
        const data = sseats.map(seat => {
            seat.set = username
            seat.updateTime = Date.now()
            return {
                area: seat.area,
                row: seat.row,
                col: seat.col
            }
        })
        return { code: 0, data }
    },
    async getBuyByUserName ({username}) {
        return allSeats.filter(seat => seat.buy === username)
    },
    async getSetByUserName ({username}) {
        return allSeats.filter(seat => seat.set === username && !seat.buy)
    },
    async buy ({username}) {
        if (!username) {
            return { code: -1, msg: '输入错误' }
        }
        const sets = await this.getSetByUserName({username})
        if (!sets.length) {
            return { code: -2, msg: '没有待支付的订单' }
        }
        sets.forEach(seat => {
            seat.buy = username
            seat.updateTime = Date.now()
        })
        return { code: 0 }
    },
    async getAllSeats () {
        return allSeats.map(seat => {
            let time
            if (!seat.buy && seat.set && (Date.now() - seat.updateTime) > 30 * 60 * 1000) {
                time = 30 * 60 - Math.ceil((Date.now() - seat.updateTime) / 1000)
                if (time < 0) {
                    seat.set = null
                } else {
                    time = void 0
                }
            }
            return { area: seat.area, row: seat.row, col: seat.col, state: seat.buy ? 'buy' : (seat.set ? 'set' : ''), time }
        })
    }
}

module.exports = ticket
