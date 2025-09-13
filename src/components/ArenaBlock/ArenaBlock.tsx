import type { ArenaImageBlock } from "arena-ts";
import { Match, Switch, Show } from "solid-js";
import { createAsync, useLocation, A } from "@solidjs/router";
import classes from "./ArenaBlock.module.scss";
import { createSignal } from "solid-js";
import { fetchBlock } from "../../lib/arena";
import { makeBlockUrl } from "../../lib/arena";
import { useBlockContext } from "../ArenaBlockProvider";

import ImageBlock from "./ArenaImageBlock";

type ArenaBlockProps = {
  width?: number;
  height?: number;
  blockId: number;
  canConnect?: boolean;
};

/**
 * Display a block from Are.na.
 */
const ArenaBlock = (props: ArenaBlockProps) => {
  const block = createAsync(() => fetchBlock(props.blockId));
  const [open, setOpen] = createSignal(false);

  const articleContext = useLocation().pathname;
  const blockContext = useBlockContext();

  return (
    <div
      style={{ "max-width": props.width?.toString() || "100%" }}
      classList={{ [classes.arenaBlockRoot]: true, [classes.open]: false }}
      onClick={() => setOpen(!open())}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setOpen(!open());
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setOpen(!open());
        }
      }}
    >
      <A
        href={
          (() => {
            const b = block();
            if (b && typeof b.id === "number") {
              return makeBlockUrl(
                b.id,
                articleContext,
                blockContext?.blockIds(),
              );
            }
            return "";
          })()
        }
      >
        <Show when={block()}>
          <Switch fallback={<div>Loading block...</div>}>
            <Match when={block()?.class === "Image"}>
              <ImageBlock
                block={block() as ArenaImageBlock}
                width={props.width}
                height={props.height}
              />
            </Match>
          </Switch>
          <Show when={props.canConnect}>
            <button type="button">Connect</button>
          </Show>
        </Show>
      </A>
    </div>
  );
};

export default ArenaBlock;
