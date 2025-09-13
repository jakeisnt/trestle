import type { ArenaChannel } from "arena-ts";
import { A } from "@solidjs/router";
import classes from "./block.module.scss";

/**
 * A link to a channel on Are.na.
 */
const ChannelLink = (props: { channel: ArenaChannel }) => {
  return (
    <A
      href={`https://are.na/channel/${props.channel.id}`}
      class={classes.channelLinkBox}
      target="_blank"
    >
      {props.channel.title}
    </A>
  );
};

export default ChannelLink;
