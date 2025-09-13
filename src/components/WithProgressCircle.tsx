import { createEffect, createSignal } from "solid-js";
import type { JSX } from "solid-js";

function ProgressCircle(props: {
  fillAmount: number;
  width: number;
  height: number;
}) {
  const radius = 45; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const threshold = 100; // Minimum distance to trigger swipe action (in pixels)

  // Create a signal to dynamically update the stroke-dashoffset
  const [getDashOffset, setDashOffset] = createSignal(circumference);
  const [pixelRadius, setPixelRadius] = createSignal(35);

  createEffect(() => {
    // Rotate the circle based on the fillAmount prop to show progress
    const offset =
      circumference -
      (Math.min(props.fillAmount, threshold) / threshold) * circumference;

    setDashOffset(offset);

    // Scale the pixel radius slightly to make the user feel good
    // when progress is 0-75%, a little bit of change but almost nothing
    // when progress is 75-95%, increase the pixel radius
    // when progress is 95-100%, decrease back to normal
    const radius = Math.min(Math.max(props.fillAmount, 75), 95);
    setPixelRadius(35 + (radius - 75) * 0.2);
  });

  return (
    <svg
      width={`${pixelRadius()}px`}
      height={`${pixelRadius()}px`}
      viewBox="0 0 100 100"
      aria-label="Progress circle"
      role="img"
    >
      <title>Progress circle</title>
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#fff"
        stroke-width="3"
        stroke-dasharray={circumference.toString()}
        stroke-dashoffset={getDashOffset()}
        style={{
          transition: "stroke-dashoffset 0.3s ease",
        }}
      />
    </svg>
  );
}

function WithProgressCircle(props: {
  Icon: (props: { width: number; height: number }) => JSX.Element;
  fillAmount: number;
  width: number;
  height: number;
}) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
        }}
      >
        <props.Icon width={props.width} height={props.height} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ProgressCircle
          fillAmount={props.fillAmount}
          width={props.width * 1.5}
          height={props.height * 1.5}
        />
      </div>
    </div>
  );
}

export default WithProgressCircle;
