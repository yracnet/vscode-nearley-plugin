import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import NEEditor from "./editor";
import "./theme/index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RecoilRoot>
    <NEEditor />
  </RecoilRoot>
);
