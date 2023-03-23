import { RecoilState, useRecoilState } from "recoil";
export type Key = string | number;

export type FnPutValue = (key: Key, value: any) => void;

export const useRecoilPutValue = <T>(node: RecoilState<T>): FnPutValue => {
  const [state, setState] = useRecoilState(node);
  const putValue = (name: Key, value: any) => {
    const attrInit: string[] = `${name}`.split(".");
    const attrLast = attrInit.pop();
    let newState = Array.isArray(state) ? [...state] : { ...state };
    let stateRef = newState;
    attrInit.forEach((attr) => {
      //@ts-ignore
      let state2 = stateRef[attr] || {};
      state2 = Array.isArray(state2) ? [...state2] : { ...state2 };
      //@ts-ignore
      stateRef[attr] = state2;
      //@ts-ignore
      stateRef = stateRef[attr];
    });
    //@ts-ignore
    stateRef[attrLast] = value;
    //@ts-ignore
    setState(newState);
  };

  return putValue;
};
