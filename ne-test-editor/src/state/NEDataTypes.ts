export type NEData = {
  config: NEConfig;
  items: NEItem[];
};

export type NEConfig = {
  source: string;
  target: string;
  createdAt?: string;
  updatedAt?: string;
  buildTime?: string;
  runTime?: string;
};

export type NEItem = {
  id: string;
  name?: string;
  input: string;
  output: string[];
  status: "success" | "error" | "unknow";
  open: boolean;
  trace: boolean;
  traces: any[];
  runTime?: string;
};
