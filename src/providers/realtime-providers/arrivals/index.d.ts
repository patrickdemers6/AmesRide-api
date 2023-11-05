import StaticGTFS from "../../static-providers/gtfs";
import { RealtimeDataAdapterOptions } from "./dataAdapters/realtimeDataAdapter";
export interface RealtimeDataProviderOptions
  extends RealtimeDataAdapterOptions {
  staticData: StaticGTFS;
}
