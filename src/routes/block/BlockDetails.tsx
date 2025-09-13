import { Show, For } from "solid-js";
import DateTime from "~/components/DateTime";
import type { ArenaBlock } from "arena-ts";
import classes from "./block.module.scss";
import { A } from "@solidjs/router";
import ChannelLink from "./ChannelLink";

/**
 * Details of an are.na block.
 */
const BlockDetails = (props: { block: ArenaBlock }) => {
  return (
    <Show when={props.block}>
      <div class={classes.blockDetails}>
        <h3>{props.block?.title}</h3>
        <Show when={props.block.description}>
          {/* eslint-disable-next-line solid/no-innerhtml */}
          <div innerHTML={props.block.description_html ?? undefined} />
        </Show>
        <div style={{ padding: "0 8px" }}>
          <table>
            <tbody>
              <tr>
                <td>Are.na ID</td>
                <td>
                  <A
                    href={`https://are.na/block/${props.block.id}`}
                    target="_blank"
                  >
                    {props.block.id}
                  </A>
                </td>
              </tr>
              <tr>
                <td>Created</td>
                <td>
                  <DateTime dateTime={props.block.created_at} />
                </td>
              </tr>

              <tr>
                <td>Updated</td>
                <td>
                  <DateTime dateTime={props.block.updated_at} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Show
          when={
            props.block.connections?.filter((c) => c.status !== "private")
              ?.length
          }
        >
          <h3>Are.na channels</h3>
          <div class={classes.channelLinkBoxList}>
            <For
              each={props.block.connections?.filter(
                (c) => c.status !== "private",
              )}
            >
              {(c) => <ChannelLink channel={c} />}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  );
};

export default BlockDetails;
