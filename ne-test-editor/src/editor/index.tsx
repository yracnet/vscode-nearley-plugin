import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useRecoilReducer } from "../hooks";
import { NE_DATA_STATE } from "../state";
import { EditorContent } from "./parts/content";
import { EditorHeader } from "./parts/header";
import { postMessage, NE_DOCUMENT_REDUCER } from "./reducer";

type EditorV1Props = {};

export const EditorV1 = (props: EditorV1Props) => {
  const value = useRecoilValue(NE_DATA_STATE);
  const onDispatch = useRecoilReducer(NE_DOCUMENT_REDUCER, NE_DATA_STATE);

  useEffect(() => {
    const handlerMessage = (event: any) => {
      onDispatch(event.data);
    };
    window.addEventListener("message", handlerMessage);
    postMessage({ type: "editor:load" });
    return () => {
      window.removeEventListener("message", handlerMessage);
    };
  }, []);

  useEffect(() => {
    const payload = JSON.stringify(value);
    postMessage({ type: "editor:change", payload });
  }, [value]);

  return (
    <div>
      <EditorHeader />
      <EditorContent />
    </div>
  );
};

export default EditorV1;
