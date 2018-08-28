const areas = ['A', 'B', 'C', 'D']
const firstRow = 50
const add = 2
const lastRow = 100

const rows = []
for (let i = 0, n = ((lastRow - firstRow) / add + 1); i < n; i++) {
    rows.push(firstRow + add * i)
}
const seats = areas.map(area => {
    return {
        area: area,
        rows: rows.slice()
    }
})

const buys = []

const buy = {
    async buyTickets (args) {
        if (!args.id || !args.num) {
            return -1
        }
        if (buys.some(buy => buy.id === args.id)) {
            return -2
        }
        
    }
}