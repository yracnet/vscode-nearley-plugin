import { FnReducer, MapReducer } from "../hooks";
import { createNEItem, NEConfig, NEData, NEItem } from "../state";

const vscode =
  //@ts-ignore
  typeof acquireVsCodeApi !== "undefined"
    ? //@ts-ignore
      acquireVsCodeApi()
    : {
        postMessage: (payload: any) => {
          console.debug("FAKE postMessage", payload);
        },
      };

export const postMessage = (action: any) => vscode.postMessage(action);

const updateItem = (
  state: NEItem[],
  pk: string,
  apply: (value: NEItem) => void
) => {
  return state.map((it) => {
    if (it.id === pk) {
      it = { ...it };
      apply(it);
    }
    return it;
  });
};

export const NE_ITEM_REDUCER: MapReducer<NEItem[]> = {
  "item:add": (state) => {
    let item = createNEItem();
    return [...state, item];
  },
  "item:remove": (state, { value }) => {
    return state.filter((it) => it.id !== value);
  },
  "item:up": (state, { value }) => {
    state = [...state];
    let ix = state.findIndex((it) => it.id === value);
    if (ix > 0) {
      let aux = state[ix];
      state[ix] = state[ix - 1];
      state[ix - 1] = aux;
    }
    return state;
  },
  "item:down": (state, { value }) => {
    state = [...state];
    let ix = state.findIndex((it) => it.id === value);
    if (ix < state.length - 1) {
      let aux = state[ix];
      state[ix] = state[ix + 1];
      state[ix + 1] = aux;
    }
    return state;
  },
  "item:open-toggle": (state, { value }) => {
    return updateItem(state, value, (it) => {
      it.open = !it.open;
    });
  },
  "item:trace-toggle": (state, { value }) => {
    return updateItem(state, value, (it) => {
      it.trace = !it.trace;
    });
  },
};

export const NE_CONFIG_REDUCER: MapReducer<NEConfig> = {};

export const NE_DATA_REDUCER: FnReducer<NEData> = (state, action) => {
  // console.log("NE_DATA_REDUCER>>>>", action);
  let { config, items } = state;
  let { type } = action;
  config = NE_CONFIG_REDUCER[type]?.(config, action) || config;
  items = NE_ITEM_REDUCER[type]?.(items, action) || items;
  state = { config, items };
  state = NE_RUN_REDUCER(state, action);
  return state;
};

export const NE_RUN_REDUCER: FnReducer<NEData> = (state, action) => {
  let { type, value } = action;
  if (type.startsWith("run:")) {
    console.log("NE_RUN_REDUCER>>>>", type);
    let payload = JSON.stringify(state);
    let message = { type, value, payload };
    vscode.postMessage(message);
  }
  return state;
};

const assertNeTest = (newState: any) => {
  if (newState.grammar && newState.items) {
    newState = {
      config: {
        source: newState.source,
        target: newState.grammar,
      },
      items: newState.items.map((it: any, ix: number) => {
        return {
          id: "X" + ix,
          name: it.name,
          input: it.content,
          output: [],
          traces: [],
        };
      }),
    };
  }
  return newState;
};

export const NE_DOCUMENT_REDUCER: FnReducer<NEData> = (state, action) => {
  let { type, payload } = action;
  if (type?.startsWith("document:open")) {
    let newState: any = JSON.parse(payload);
    // Migrate Old Version
    state = assertNeTest(newState);
  } else if (type?.startsWith("document:")) {
    console.log("NE_DOCUMENT_REDUCER>>>>", type);
    state = JSON.parse(payload);
  }
  return state;
};
