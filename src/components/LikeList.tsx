import {
  type RouteDefinition,
  type RouteSectionProps,
  action,
  cache,
  createAsync,
  json,
} from "@solidjs/router";

import { For } from "solid-js";

const LIKES = [
  "change",
  "architecture",
  "internet",
  "chairs",
  "bicycles",
  "photos",
  "legislation for progress",
  "friends",
  "items that wear with you",
  "paper",
  "self-expression",
  "sunlight",
  "currency",
  "maps",
  "clothes",
  "types (math)",
  "introspection",
  "tools",
  "letters (mail)",
  "items that last forever",
  "calendars",
  "sweaters",
  "feedback",
  "videos",
  "sketching",
  "smartphones",
  "reading",
  "opinions",
  "feeling uncomfortable",
  "pens",
  "beds",
  "boots",
  "feeling comfortable",
  "shadows",
  "software",
];

// get all likes from the database
const getNotes = cache(async () => {
  "use server";

  const shuffledLikes = [...LIKES].sort(() => Math.random() - 0.5);
  return shuffledLikes;
}, "notes");

/**
 * A list of things I like.
 * Prioritized in some way.
 */
const LikeList = () => {
  const likes = createAsync<string[]>(() => getNotes(), {
    initialValue: [],
  });

  return (
    <ul>
      <For each={likes()}>{(like) => <li>{like}</li>}</For>
    </ul>
  );
};

export default LikeList;
