export interface StoreFactory<State extends object> {
  (): State
}

export interface StoreSubscriber<State extends object> {
  (state: State): void
}

export interface StoreUnsubscribe {
  (): void
}

export interface StoreUpdater<State extends object> {
  (state: State): State
}

export interface Store<State extends object> {
  getState(): State
  patchState(partialState: Partial<State>): void
  resetState(): void
  setState(nextState: State): void
  subscribe(subscriber: StoreSubscriber<State>): StoreUnsubscribe
  updateState(updater: StoreUpdater<State>): void
}

export function createStore<State extends object>(
  createInitialState: StoreFactory<State>,
): Store<State> {
  const subscribers = new Set<StoreSubscriber<State>>()
  let currentState = createInitialState()

  function getState(): State {
    return currentState
  }

  function setState(nextState: State): void {
    if (Object.is(currentState, nextState)) {
      return
    }

    currentState = nextState
    notifySubscribers()
  }

  function patchState(partialState: Partial<State>): void {
    setState({
      ...currentState,
      ...partialState,
    })
  }

  function updateState(updater: StoreUpdater<State>): void {
    setState(updater(currentState))
  }

  function resetState(): void {
    setState(createInitialState())
  }

  function subscribe(
    subscriber: StoreSubscriber<State>,
  ): StoreUnsubscribe {
    subscribers.add(subscriber)

    return function unsubscribe(): void {
      subscribers.delete(subscriber)
    }
  }

  function notifySubscribers(): void {
    for (const subscriber of subscribers) {
      subscriber(currentState)
    }
  }

  return {
    getState: getState,
    patchState: patchState,
    resetState: resetState,
    setState: setState,
    subscribe: subscribe,
    updateState: updateState,
  }
}
