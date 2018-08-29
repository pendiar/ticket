const __userinfo = []

const userinfo = {

    async register(args) {

        if (!args.username || !args.password) {
            return { code: -1 }
        }

        if (__userinfo.some(user => user.username === args.username)) {
            return { code: -2 }
        }

        __userinfo.push(args)

        return { code: 0 }
    },
    async login(args) {

        if (!args.username || !args.password) {
            return { code: -1 }
        }

        const result = { code: -2, id: null }

        __userinfo.forEach((user, index) => {
            if (user.username === args.username) {
                if (user.password !== args.password) {
                    result.code = -3
                } else {
                    result.code = 0
                    result.id = index
                }
            }
        })

        return result
    },
    async getById(id) {
        return __userinfo[id] || null
    }
}

module.exports = userinfo