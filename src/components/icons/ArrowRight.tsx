export default function ArrowRight(props: { height: number; width: number }) {
  return (
    <svg
      fill="currentColor"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      height={props.height}
      width={props.width}
      aria-label="Arrow right"
      role="img"
      style={{ overflow: "visible", color: "currentcolor" }}
    >
      <path
        stroke-width={3}
        d="m8.64 5 2.5 2.5v.7l-2.5 2.5-.71-.7 1.64-1.65H4v-1h5.57L7.92 5.7l.72-.7z"
      />
    </svg>
  );
}
