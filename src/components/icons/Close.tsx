export default function Close(props: { height: number; width: number }) {
  return (
    <svg
      fill="currentColor"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      height={props.height}
      width={props.width}
      aria-label="Close"
      role="img"
      style={{
        overflow: "visible",
        color: "currentcolor",
      }}
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        stroke-width={3}
        d="m8 8.707 3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
