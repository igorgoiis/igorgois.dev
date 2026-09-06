import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true só depois da hidratação, sem setState em effect. */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
