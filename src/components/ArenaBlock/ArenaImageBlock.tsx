import { ArenaImageBlock } from "arena-ts";
import { createEffect, createSignal } from "solid-js";
import classes from "./ArenaBlock.module.scss";
import { useBlockContext } from "../ArenaBlockProvider";

type PhotoBlockProps = {
  block: ArenaImageBlock;
  width?: number;
  height?: number;
  clickBehavior?: "link" | "zoom" | "none";
};

export const ImageBlock = (props: PhotoBlockProps) => {
  let imgRef: HTMLImageElement | undefined;
  const [imgContainerRef, setImgContainerRef] = createSignal<HTMLDivElement>();
  const blockContext = useBlockContext();

  createEffect(() => {
    let imgContainer = imgContainerRef();
    const ctx = blockContext;
    if (!imgContainer || !ctx) return;

    ctx.registerBlock(props.block.id, imgContainer);
  });

  return (
    <div
      ref={setImgContainerRef}
      classList={{ "arena-block": true, [classes.imageBlockBox]: true }}
      id={props.block.id.toString()}
    >
      <img
        ref={imgRef}
        classList={{
          [classes.arenaBlockImage]: false,
        }}
        src={props.block.image.display.url}
        width={props.width || "100%"}
        height={props.height || "auto"}
        alt={props.block.title || ""}
      />
      <p class={classes.imageBlockDescription}>{props.block.title}</p>
    </div>
  );
};

export default ImageBlock;
