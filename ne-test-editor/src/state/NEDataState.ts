//@ts-ignore
import { v4 as uuidv4 } from "uuid";

import { atom, selector } from "recoil";
import { NEConfig, NEData, NEItem } from "./NEDataTypes";

export const createNEItem = (): NEItem => {
  const id = uuidv4();
  return {
    id,
    name: "Test " + id.split("-")[4],
    input: "",
    output: [],
    status: "unknow",
    open: true,
    trace: false,
    traces: [],
  };
};

export const INIT: NEData = {
  config: {
    source: "",
    target: "",
  },
  items: [],
};

export const NE_DATA_STATE = selector<NEData>({
  key: "ne-data",
  get: ({ get }) => {
    const config = get(NE_CONFIG_STATE);
    const items = get(NE_ITEMS_STATE);
    return {
      config,
      items,
    };
  },
  set: ({ set }, value) => {
    let data = <NEData>value;
    set(NE_CONFIG_STATE, data.config);
    set(NE_ITEMS_STATE, data.items);
  },
});
export const NE_CONFIG_STATE = atom<NEConfig>({
  key: "ne-config",
  default: {
    source: "",
    target: "",
  },
});

export const NE_ITEMS_STATE = atom<NEItem[]>({
  key: "ne-items",
  default: [],
});
