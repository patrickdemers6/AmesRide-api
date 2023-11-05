import EventEmitter from "events";

class MockProvider
  extends EventEmitter
  implements RealtimeProvider<ArrivalsByStopID>
{
  shutdown() {
    return;
  }
}

export default MockProvider;
