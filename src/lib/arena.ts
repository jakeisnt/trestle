import { ArenaClient } from "arena-ts";
import { env } from "~/env";
import { cache } from "@solidjs/router";

/**
 * Construct a URL for an internal block.
 */
const makeBlockUrl = (
  blockId: number,
  articleContext: string,
  blockOrdering?: number[],
) => {
  if (blockOrdering) {
    return `/block/${blockId}?articleContext=${encodeURIComponent(
      articleContext,
    )}&blockOrdering=${encodeURIComponent(blockOrdering.join(","))}`;
  }
  return `/block/${blockId}?articleContext=${encodeURIComponent(articleContext)}`;
};

/**
 * Fetch information about a block from Are.na.
 * Returns null if the block is inaccessible (e.g. private channel).
 */
const fetchBlock = cache(async (blockId: number) => {
  "use server";
  try {
    return await new ArenaClient({
      token: env.ARENA_PAT,
    })
      .block(blockId)
      .get();
  } catch {
    return null;
  }
}, "block");

export { makeBlockUrl, fetchBlock };
