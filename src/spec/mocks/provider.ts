import EventEmitter from "events";

class MockProvider
  extends EventEmitter
  implements RealtimeProvider<ArrivalsByStopID> {}

export default MockProvider;
