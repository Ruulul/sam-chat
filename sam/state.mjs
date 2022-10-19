import { actions } from "./actions.mjs"
import { view } from "../view.mjs"

export const state = {
    render (model) {
        console.log('Rendering state with', model)
        queueMicrotask(()=>this.nap(model));
        view.render(model);
    },
    nap ({connected}) {
        if (connected) setTimeout(actions.send("awareness"), 1000);
        return true;
    },
}