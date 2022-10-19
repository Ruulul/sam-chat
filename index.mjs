import { model } from "./sam/model.mjs";
import { state } from "./sam/state.mjs";
import { view, initIntents } from "./view.mjs";

export function init (rootNode) {
    view.root = rootNode;
    initIntents();

    model.present(state);
}