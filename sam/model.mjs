import { state } from "./state.mjs"

export const model = {
    messages: [],
    nicks: { info: 'info' },
    online: [],
    source: "",
    connecting: false,
    connected: false,
    event_source: undefined,
    propose ({ nick, message, awareness, connecting, connected }) {
        console.log('Getting proposal of', {nick, message, awareness})
        let changed = false;

        if (nick) {
            this.nicks[nick.from] = nick.data
            changed = true
        }
        if (message) {
            this.messages.push(message)
            changed = true
        }
        if (awareness) {
            this.online.push(awareness.from)
            setTimeout(()=>{
                this.online = this.online.filter(id=>id!==awareness.from)
                this.present(state)
            }, 5000)
            changed = true
        }

        if (connecting) {
            this.connected = false;
            this.connecting = true;
            let { to, events } = connecting;
            this.source = to;
            this.event_source = new EventSource(to);
            Object.entries(events).forEach(([key, value])=>this.event_source[key]=value)
            this.event_source.addEventListener("open", _ => this.propose({ connected: true }))
            changed = true;
        }

        if (connected === true) {
            this.messages.push({from: 'info', data: `Room: ${this.source.split('pubsub://')[1].split('?')[0]}`})
            this.connected = true;
            this.connecting = false;
            changed = true;
        }
        
        if (changed) {
            this.present(state);
        }
    },
    present (state) {
        state.render(this);
    },
}