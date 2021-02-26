import { Dict } from "./genericTypes";
import { isDefined } from "./guards";

type RegisterEvent = {
  (eventName: string, callback: Function): void;
};

type UnregisterEvent = {
  (eventName?: string, callback?: Function): void;
};

type SendEvent = {
  (eventName: string, payload?: unknown): void;
};

export interface EventBus {
  on: RegisterEvent;
  off: UnregisterEvent;
  send: SendEvent;
}

export const createEventBus = (): EventBus => {
  const registeredEvents: Dict<Function[]> = {};

  return {
    on: (eventName, callback) => {
      // Because type guards and expression indices don't play nice, we need to extract this variable out to satisfy the compiler.
      const eventsForEventName = registeredEvents[eventName];
      if (isDefined(eventsForEventName)) {
        registeredEvents[eventName] = [...eventsForEventName, callback];
      } else {
        registeredEvents[eventName] = [callback];
      }
    },
    off: (eventName, callback) => {
      if (!eventName) {
        Object.keys(registeredEvents).forEach(key => {
          delete registeredEvents[key];
        });
      } else if (!callback) {
        delete registeredEvents[eventName];
      } else {
        registeredEvents[eventName] =
          registeredEvents[eventName]?.filter(cb => cb !== callback) ?? [];
      }
    },
    send: (eventName, payload) => {
      registeredEvents[eventName]?.forEach(cb => cb(payload));
    }
  };
};
