import { RecoilState } from "recoil";
import { useRecoilPutValue } from "./useRecoilPutValue";
export type Key = string | number;
export type FnPutState = <T>(state: T, value: any) => void;
export type CacheFnPutState = {
  [key: Key]: FnPutState;
};
export type FnOnChange = (event: any) => void;

export const useRecoilOnChange = <T>(node: RecoilState<T>): FnOnChange => {
  const putValue = useRecoilPutValue(node);
  const onChange = (event: any) => {
    const { name, value } = event.target;
    putValue(name, value);
  };
  return onChange;
};
