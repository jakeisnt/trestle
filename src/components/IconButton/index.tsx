import classes from "./IconButton.module.scss";
import { JSX } from "solid-js/jsx-runtime";

type IconButtonProps = {
  children: JSX.Element;
  class?: string;
  onClick?: (e: MouseEvent) => void;
};

const IconButton = (props: IconButtonProps) => (
  <button
    classList={{
      [classes.iconButton]: true,
      [props.class ?? ""]: true,
    }}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      props.onClick?.(e);
    }}
    onTouchStart={(e) => {
      e.stopPropagation();
    }}
    onTouchEnd={(e) => {
      e.stopPropagation();
    }}
  >
    {props.children}
  </button>
);

export default IconButton;
