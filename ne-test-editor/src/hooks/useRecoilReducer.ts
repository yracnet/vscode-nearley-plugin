import { RecoilState, useRecoilState } from "recoil";

export type FnDispatch<A = any> = (action: A) => void;

export type FnReducer<T, A = any> = (state: T, action: A) => T;

export type MapReducer<T, A = any> = {
  [key: string]: FnReducer<T, A>;
};

export const useRecoilReducer = <T, A = any>(
  reducer: FnReducer<T, A> | MapReducer<T, A>,
  node: RecoilState<T>
): FnDispatch<A> => {
  const [state, setState] = useRecoilState(node);
  let fnReducer: FnReducer<T, A> =
    typeof reducer === "function"
      ? reducer
      : (state, action: any) => {
          let cb = reducer[action.type];
          console.log(">>>MAP_REDUCER: ", action.type, cb);
          return cb?.(state, action) || state;
        };

  const dispatch = (action: A) => {
    let newState = fnReducer(state, action);
    if (newState !== state) {
      setState(newState);
    }
  };
  return dispatch;
};
