export default function ArrowLeft(props) {
  return (
    <svg
      fill="currentColor"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      height={props.height}
      width={props.width}
      style={{ overflow: "visible", color: "currentcolor" }}
    >
      <path
        stroke-width={3}
        d="M6.5 10.7 4 8.2v-.7L6.5 5l.71.7-1.64 1.65h5.57v1H5.57L7.22 10l-.72.7z"
      />
    </svg>
  );
}
