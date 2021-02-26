import { EventBus, createEventBus } from "@/utils/eventBus";

describe("Event Bus", () => {
  let bus: EventBus;
  // make a new bus for each test.
  beforeEach(() => {
    bus = createEventBus();
  });

  it("can register events and have them be called.", () => {
    const spy = jest.fn();

    bus.on("stranger", spy);
    bus.on("danger", spy);
    bus.on("the lord ruler is an upstanding individual", spy);
    bus.on("spiders are evil monstrosities from the depths", spy);

    bus.send("stranger");
    bus.send("danger");

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("can send payloads when sending events", () => {
    const spy = jest.fn();
    bus.on("stranger", spy);
    bus.on("danger", spy);
    bus.on("the lord ruler is an upstanding individual", spy);
    bus.on("spiders are evil monstrosities from the depths", spy);

    bus.send("stranger", "danger");
    bus.send("danger", "stranger");
    bus.send("spiders are evil monstrosities from the depths", {
      object: true
    });

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, "danger");
    expect(spy).toHaveBeenNthCalledWith(2, "stranger");
    expect(spy).toHaveBeenNthCalledWith(3, { object: true });
  });

  it("does not call callbacks when unrelated events are fired", () => {
    const spy = jest.fn();

    bus.on("ha", spy);
    bus.on("ho", spy);

    bus.send("hi");
    bus.send("ungus bungus");

    expect(spy).not.toHaveBeenCalled();

    bus.send("ha");

    expect(spy).toHaveBeenCalled();
  });

  it("let's you unregister specific callbacks", () => {
    const spy = jest.fn();
    const anotherSpy = jest.fn();

    bus.on("test", spy);
    bus.on("test", anotherSpy);
    bus.send("test");

    expect(spy).toHaveBeenCalled();
    expect(anotherSpy).toHaveBeenCalled();

    bus.off("test", spy);
    bus.send("test");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(anotherSpy).toHaveBeenCalledTimes(2);
  });

  it("let's you unregister all callbacks for a given event", () => {
    const spy = jest.fn();
    const anotherSpy = jest.fn();
    const iSpy = jest.fn();

    bus.on("test", spy);
    bus.on("test", anotherSpy);
    bus.on("test2", iSpy);
    bus.send("test");

    expect(spy).toHaveBeenCalled();
    expect(anotherSpy).toHaveBeenCalled();
    expect(iSpy).not.toHaveBeenCalled();

    bus.off("test");
    bus.send("test");
    bus.send("test2");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(anotherSpy).toHaveBeenCalledTimes(1);
    expect(iSpy).toHaveBeenCalledTimes(1);
  });

  it("lets you unregister all events", () => {
    const spy = jest.fn();
    const anotherSpy = jest.fn();
    const iSpy = jest.fn();

    bus.on("test", spy);
    bus.on("test", anotherSpy);
    bus.on("my little eye", iSpy);
    bus.send("test");

    expect(spy).toHaveBeenCalled();
    expect(anotherSpy).toHaveBeenCalled();
    expect(iSpy).not.toHaveBeenCalled();

    bus.off();
    bus.send("test");
    bus.send("my little eye");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(anotherSpy).toHaveBeenCalledTimes(1);
    expect(iSpy).not.toHaveBeenCalled();
  });
});
