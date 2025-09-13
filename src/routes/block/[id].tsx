import {
  type RouteDefinition,
  type RouteSectionProps,
  useSearchParams,
} from "@solidjs/router";
import { createEffect, Show, For, createSignal } from "solid-js";
import { A, createAsync, useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";

import { makeBlockUrl } from "~/lib/arena";
import { useKeyboardShortcut, useIsDesktop } from "~/lib/hooks";

import { fetchBlock } from "~/lib/arena";

import classes from "./block.module.scss";
import SwipeableCard from "../../components/SwipeableCard";
import ZoomableImage from "../../components/ZoomableImage";
import { Close, ArrowLeft, ArrowRight, CaretUp } from "../../components/icons";
import IconButton from "../../components/IconButton";
import type { ArenaBlock } from "arena-ts";

export const route = {
  load: async ({ params }) => {
    const blockId = Number(params.id as string);
    return fetchBlock(blockId);
  },
  preload: async ({ params }) => {
    const blockId = Number(params.id as string);
    return fetchBlock(blockId);
  },
} satisfies RouteDefinition;

/**
 * Use search params specific to the block.
 * Parse and format the params.
 */
const useBlockParams = () => {
  const [searchParams] = useSearchParams();

  const blockOrdering = (() => {
    const ordering = searchParams.blockOrdering;
    if (!ordering) return undefined;
    
    const orderString = Array.isArray(ordering) ? ordering[0] : ordering;
    const order = orderString.split(",").map((id: string) => Number(id));

    return order.length > 0 ? order : undefined;
  })();

  const articleContext = (() => {
    const context = searchParams.articleContext;
    if (!context) return "";
    
    const contextString = Array.isArray(context) ? context[0] : context;
    return decodeURIComponent(contextString);
  })();

  return {
    blockOrdering,
    articleContext,
  };
};

/**
 * Fetch an image from the URL.
 * This is used to prefetch images in the block.
 */
const fetchImage = async (url: string) => {
  const response = await window.fetch(url);
  return response.blob();
};

/**
 * A page that displays a block from Are.na.
 * Usually available when clicking on a block.
 */
export default function BlockPage(props: RouteSectionProps) {
  const blockId = () => Number(props.params.id as string);
  const block = createAsync(() => fetchBlock(blockId()));
  const { blockOrdering, articleContext } = useBlockParams();

  const [swipeState, setSwipeState] = createSignal<"swiping" | "none">("none");
  const [showBlockFooter, setShowBlockFooter] = createSignal(false);

  const isDesktop = useIsDesktop();

  createEffect(() => {
    setShowBlockFooter(isDesktop());
  });

  const navigate = useNavigate();

  const [blockList, setBlockList] = createSignal<ArenaBlock[]>([]);

  // Prefetch information about all of the pages accessible from here.
  createEffect(() => {
    // Prefetch all of the blocks in the block ordering,
    // preventing content flash when navigating between blocks.
    // Preload all of the images for the blocks also.
    if (!blockOrdering) return;
    Promise.all(blockOrdering.map((id: number) => fetchBlock(id)))
      .then((blocks) =>
        blocks.map((block: ArenaBlock) => {
          block.image?.display.url && fetchImage(block.image.display.url);
          return block;
        }),
      )
      .then((blocks) => setBlockList(blocks));
  });

  /**
   * Visit the block (n) blocks before or after the current one.
   */
  const navigateBlock = (offset: number) => {
    if (!blockOrdering) return;
    const currentIndex = blockOrdering.indexOf(blockId());
    const nextIndex =
      (currentIndex + offset + blockOrdering.length) % blockOrdering.length;
    const navString = makeBlockUrl(
      blockOrdering[nextIndex],
      articleContext,
      blockOrdering,
    );
    navigate(navString);
  };

  /**
   * Visit the previous block in the block ordering.
   */
  const visitPreviousBlock = () => navigateBlock(-1);

  /**
   * Visit the next block in the block ordering.
   */
  const visitNextBlock = () => navigateBlock(1);

  /**
   * Close the block, going back to the page's article context.
   */
  const closeBlock = () => {
    navigate(articleContext ? `${articleContext}` : "/");
  };

  /**
   * Support block navigation with keyboard shortcuts
   * that miror the swipe gestures.
   */
  useKeyboardShortcut((e) => {
    if (e.key === "Escape" || e.key === "ArrowDown") {
      closeBlock();
    }

    if (e.key === "ArrowLeft") {
      visitPreviousBlock();
    }

    if (e.key === "ArrowRight") {
      visitNextBlock();
    }
  });

  return (
    <div class={classes.blockPage}>
      <div class={classes.blockProgressContainer}>
        <div
          class={classes.blockProgress}
          style={{
            opacity: swipeState() === "swiping" ? 0 : 0.5,
            transition: "opacity 0.3s",
          }}
        >
          <For each={blockOrdering}>
            {(id) => (
              <A
                class={classes.blockProgressItem}
                href={makeBlockUrl(id, articleContext, blockOrdering)}
                style={{
                  "background-color": id === blockId() ? "#fff" : "#333",
                }}
              />
            )}
          </For>
        </div>
      </div>

      <SwipeableCard
        class={classes.blockBox}
        onSwipeStart={() => {
          setSwipeState("swiping");
        }}
        onSwipeEnd={() => {
          setSwipeState("none");
        }}
        onSwipeLeft={
          blockOrdering
            ? () => {
                visitPreviousBlock();
              }
            : undefined
        }
        onSwipeRight={
          blockOrdering
            ? () => {
                visitNextBlock();
              }
            : undefined
        }
        onSwipeDown={() => {
          closeBlock();
        }}
        refetchId={blockId()}
      >
        <ZoomableImage
          src={block()?.image?.display.url ?? ""}
          alt={block()?.title ?? "arena block image"}
          class={classes.blockImage}
          width="100%"
          height="100%"
        />
        <div class={classes.verticalSeparator} />
        <div class={classes.rightPanel}>
          <Show when={block()}>
            <Title>
              {block()?.title} (#{block()?.id}) | Jake Chvatal
            </Title>
            <p
              class={classes.blockDescription}
              // eslint-disable-next-line solid/no-innerhtml
              innerHTML={block()?.description_html ?? ""}
            />
          </Show>
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "center",
            }}
          >
            <Show when={block()}>
              <h4
                style={{
                  margin: 0,
                  "font-style": "normal",
                  "font-weight": 400,
                  "padding-left": "10px",
                  "padding-bottom": "6px",
                  "text-overflow": "ellipsis",
                  "white-space": "nowrap",
                  overflow: "hidden",
                }}
              >
                {block()?.title}
              </h4>
            </Show>
            <div class={classes.actionButtons}>
              <Show when={blockOrdering}>
                <Show when={!isDesktop()}>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowBlockFooter((curFooter) => !curFooter);
                    }}
                  >
                    <div
                      style={{
                        transform: `rotate(${showBlockFooter() ? 180 : 0}deg)`,
                        transition: "transform 0.2s ease-in-out",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                      }}
                    >
                      <CaretUp />
                    </div>
                  </IconButton>
                </Show>

                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    visitPreviousBlock();
                  }}
                >
                  <ArrowLeft width={20} height={20} />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    visitNextBlock();
                  }}
                >
                  <ArrowRight width={20} height={20} />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeBlock();
                  }}
                >
                  <Close width={20} height={20} />
                </IconButton>
              </Show>
            </div>
          </div>
        </div>
      </SwipeableCard>
      <div
        class={classes.blockFooterContainer}
        style={{
          transform:
            !blockList() || swipeState() === "swiping" || !showBlockFooter()
              ? "translateY(100%)"
              : "none",
        }}
      >
        <div class={classes.blockFooter}>
          <For each={blockList()}>
            {(block) => (
              <A
                classList={{
                  [classes.blockFooterItem]: true,
                  [classes.blockFooterItemSelected]: block.id === blockId(),
                }}
                href={makeBlockUrl(block.id, articleContext, blockOrdering)}
              >
                <img
                  class={classes.blockFooterImage}
                  src={block?.image?.display.url}
                  alt={block?.title ?? "arena block image"}
                />
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
