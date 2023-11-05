import EventEmitter from "events";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type DataAdapter<T> = EventEmitter & {
  get(): Promise<void>;
  shutdown();
};
