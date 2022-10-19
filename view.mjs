import { actions } from "./sam/actions.mjs"

const intents = {
    intent (fn, key) {
        return (e) => {
            e.preventDefault()
            e.submitter.disabled = true
            let el = e.target.elements[key]
            console.log(`${key} element:`, el)
            if (el.value.length > 0) fn(el.value)
            el.value = ''
            e.submitter.disabled = false
        }
    },
    enterRoom:      (e) => intents.intent(actions.enterRoom, 'room')(e),
    sendMessage:    (e) => intents.intent(actions.sendMessage, 'message')(e),
    changeNick:     (e) => intents.intent(actions.changeNick, 'nick')(e),
}

export const initIntents = () => Object.entries(intents).forEach(([key, value])=> (key !== 'intent') && (window[key] = value))
export const view = {
    root: undefined,
    render ({messages, nicks, online, source, connected, connecting}) {
        let el_messages = this.root.querySelector(".messages");
        let el_online = this.root.querySelector(".online");
        let el_status = this.root.querySelector(".connection-status");

        el_status.textContent =
            connecting 
                ? `Connecting to ${source}...` 
            : connected 
                ? `Connected to ${source}!` 
            : "Insert a room"

        el_messages.innerHTML = ''
        messages.forEach(({data, from})=>{
            el_messages.innerHTML += `<p>
                <span title="PeerId: ${from}">${nicks[from] || "Anom"}</span>: ${data}
            </p>`
        })

        el_online.innerHTML = ''
        online.forEach(peerId=>{
            el_online.innerHTML += `<li title="PeerId: ${peerId}">${nicks[peerId] || "Anom"}</li>`
        })

        this.root.querySelectorAll(".inputs input").forEach(input=>input.disabled = !source)
    }
}