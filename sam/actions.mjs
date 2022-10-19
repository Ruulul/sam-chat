import { model } from "./model.mjs"

export const actions = {
    send (type) {
        return function (data) {
            console.log(`Sending ${type} message with ${data} to ${model.source}`)
            return model.source ? fetch (model.source, {
                type,
                data
            }) : Promise.resolve({})
        }
    },
    async enterRoom (room) {
        model.propose({
            connecting: {
                to: ['pubsub://', room, '?format=json'].join(''),
                events: {
                    onopen: actions.send("awareness"),
                    onmessage: actions.receive,
                } 
            }
        })
    },
    sendMessage (data) {
        model.propose({message:{from: 'you', data}})
        return actions.send("message")(data)
    },
    async changeNick (data) {
        model.propose({nick:{from: 'you', data}})
        return actions.send("nick")(data)
    },
    async receive (message) {
        console.log(`Received`, message)
        let { from, type, data } = JSON.parse(message)
        if (['nick', 'awareness', 'message'].includes(type))
            model.propose({[type]: {data, from}})
    }
}