import { Plugin } from "vite";

type SignSetting = {
  content: string;
};
export const SignPlugin = (config: SignSetting): Plugin => {
  return {
    name: "sign-plugin",
    generateBundle(_, bundle) {
      const { content = "" } = config;
      for (const ix in bundle) {
        //@ts-ignore
        //let code = bundle[ix].code;
        //@ts-ignore
        bundle[ix].code = content + "\n" + bundle[ix].code;
      }
    },
  };
};
