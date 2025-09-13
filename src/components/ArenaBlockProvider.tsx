import { createContext, useContext, createSignal, createEffect, createMemo } from "solid-js";
import { JSX } from "solid-js";
import { useLocation } from "@solidjs/router";

type BlockContextType = {
  registerBlock: (blockId: number, pageElement: HTMLElement) => void;
  blockIds: () => number[];
};

// Create the context
const BlockContext = createContext<BlockContextType>();

type BlockProviderProps = {
  children: JSX.Element;
};

const BlockProvider = (props: BlockProviderProps) => {
  const [blocks, setBlocks] = createSignal<
    {
      id: number;
      element: HTMLElement;
    }[]
  >([]);

  /**
   * Register a block with the context.
   * Should be invoked when a block is first rendered.
   */
  const registerBlock = (blockId: number, pageElement: HTMLElement) => {
    setBlocks((prev) => [...prev, { id: blockId, element: pageElement }]);
  };

  // Sort the blocks by the position of the element in the DOM;
  // the top left element should always be the first in the array.
  const blockIds = createMemo(() => {
    let sortedBlocks = blocks();
    sortedBlocks = sortedBlocks.sort((a, b) => {
      const pos = a.element.compareDocumentPosition(b.element);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }
      return 0;
    });

    return sortedBlocks.map(({ id }) => id);
  });

  return (
    <BlockContext.Provider value={{ registerBlock, blockIds }}>
      {props.children}
    </BlockContext.Provider>
  );
};

/**
 * Use the block context for the current page.
 * As blocks aren't required to have the context,
 * this may not provide any context.
 */
const useBlockContext = (): BlockContextType | undefined => {
  return useContext(BlockContext);
};

export { BlockProvider, useBlockContext };
