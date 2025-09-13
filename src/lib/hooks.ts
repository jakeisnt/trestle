import { createEffect, createSignal, onCleanup } from "solid-js";

// Little hooks that come in handy.

/**
 * Listen for document keyboard events.
 * Invoke the callback when the key is pressed.
 */
const useKeyboardShortcut = (callback: (e: KeyboardEvent) => void) => {
  createEffect(() => {
    const listener = (e: KeyboardEvent) => {
      callback(e);
    };

    document.addEventListener("keydown", listener);

    onCleanup(() => {
      document.removeEventListener("keydown", listener);
    });
  });
};

/**
 * Detect if the window is currently on a desktop device.
 */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = createSignal(false);

  createEffect(() => {
    setIsDesktop(window.innerWidth > 600);

    // resize observer
    const resizeObserver = new ResizeObserver(() => {
      setIsDesktop(window.innerWidth > 600);
    });

    resizeObserver.observe(document.body);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  return isDesktop;
};

export { useKeyboardShortcut, useIsDesktop };
