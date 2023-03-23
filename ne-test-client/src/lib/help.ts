import fs from "fs";

export const readObjectSync = (source: string) => {
  const raw = fs.readFileSync(source);
  return JSON.parse(raw.toString());
};
export const writeObjectSync = (object, output) => {
  const content =
    typeof object === "string" ? object : JSON.stringify(object, null, 2);
  fs.writeFileSync(output, content);
};
