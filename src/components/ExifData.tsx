import { createSignal, createEffect, Show } from "solid-js";
import classes from "./ExifData.module.scss";

interface ExifData {
  make?: string;
  model?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  focalLength?: string;
  dateTime?: string;
  exposureMode?: string;
  whiteBalance?: string;
  flash?: string;
  meteringMode?: string;
  lensModel?: string;
}

interface ExifDataProps {
  imageUrl: string;
}

const EXPOSURE_MODES = ["Auto", "Manual", "Auto bracket"];
const WB_MODES = ["Auto", "Manual"];
const FLASH_MODES: Record<number, string> = {
  0: "No Flash",
  1: "Fired",
  5: "Fired, Return not detected",
  7: "Fired, Return detected",
  16: "Off, Did not fire",
  24: "Auto, Did not fire",
  25: "Auto, Fired",
};
const METERING_MODES = [
  "Unknown",
  "Average",
  "Center Weighted Average",
  "Spot",
  "Multi Spot",
  "Pattern",
  "Partial",
];

const ExifData = (props: ExifDataProps) => {
  const [exifData, setExifData] = createSignal<ExifData | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(() => {
    const url = props.imageUrl;
    if (!url) return;

    setLoading(true);
    setError(null);
    setExifData(null);

    import("exifr")
      .then((mod) => mod.default.parse(url))
      .then((raw) => {
        if (!raw) {
          setExifData(null);
          return;
        }

        const data: ExifData = {};

        if (raw.Make) data.make = raw.Make as string;
        if (raw.Model) data.model = raw.Model as string;
        if (raw.LensModel) data.lensModel = raw.LensModel as string;

        const fnum = raw.FNumber as number | undefined;
        if (fnum) data.aperture = `f/${fnum}`;

        const exp = raw.ExposureTime as number | undefined;
        if (exp) {
          data.shutterSpeed =
            exp < 1 ? `1/${Math.round(1 / exp)}s` : `${exp}s`;
        }

        const iso = raw.ISO as number | undefined;
        if (iso) data.iso = `ISO ${iso}`;

        const fl = raw.FocalLength as number | undefined;
        if (fl) data.focalLength = `${fl}mm`;

        const dt = (raw.DateTimeOriginal ?? raw.DateTime) as Date | string | undefined;
        if (dt instanceof Date) {
          data.dateTime = dt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } else if (typeof dt === "string") {
          data.dateTime = dt;
        }

        const em = raw.ExposureMode as number | undefined;
        if (em != null) data.exposureMode = EXPOSURE_MODES[em] ?? "Unknown";

        const wb = raw.WhiteBalance as number | undefined;
        if (wb != null) data.whiteBalance = WB_MODES[wb] ?? "Unknown";

        const fl2 = raw.Flash as number | undefined;
        if (fl2 != null) data.flash = FLASH_MODES[fl2] ?? "Unknown";

        const mm = raw.MeteringMode as number | undefined;
        if (mm != null) data.meteringMode = METERING_MODES[mm] ?? "Unknown";

        setExifData(
          Object.keys(data).length > 0 ? data : null,
        );
      })
      .catch((err) => {
        console.error("EXIF parse error:", err);
        setError("Failed to read EXIF data");
      })
      .finally(() => setLoading(false));
  });

  return (
    <div class={classes.exifContainer}>
      <Show when={loading()}>
        <div class={classes.exifLoading}>Loading EXIF data…</div>
      </Show>

      <Show when={error()}>
        <div class={classes.exifError}>{error()}</div>
      </Show>

      <Show when={exifData() && !loading()}>
        <h4 class={classes.exifTitle}>EXIF</h4>
        <div class={classes.exifData}>
          <Show when={exifData()?.make || exifData()?.model}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Camera</span>
              <span class={classes.exifValue}>
                {[exifData()?.make, exifData()?.model].filter(Boolean).join(" ")}
              </span>
            </div>
          </Show>
          <Show when={exifData()?.lensModel}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Lens</span>
              <span class={classes.exifValue}>{exifData()?.lensModel}</span>
            </div>
          </Show>
          <Show when={exifData()?.aperture}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Aperture</span>
              <span class={classes.exifValue}>{exifData()?.aperture}</span>
            </div>
          </Show>
          <Show when={exifData()?.shutterSpeed}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Shutter</span>
              <span class={classes.exifValue}>{exifData()?.shutterSpeed}</span>
            </div>
          </Show>
          <Show when={exifData()?.iso}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>ISO</span>
              <span class={classes.exifValue}>{exifData()?.iso}</span>
            </div>
          </Show>
          <Show when={exifData()?.focalLength}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Focal Length</span>
              <span class={classes.exifValue}>{exifData()?.focalLength}</span>
            </div>
          </Show>
          <Show when={exifData()?.exposureMode}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Exposure</span>
              <span class={classes.exifValue}>{exifData()?.exposureMode}</span>
            </div>
          </Show>
          <Show when={exifData()?.whiteBalance}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>White Balance</span>
              <span class={classes.exifValue}>{exifData()?.whiteBalance}</span>
            </div>
          </Show>
          <Show when={exifData()?.flash}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Flash</span>
              <span class={classes.exifValue}>{exifData()?.flash}</span>
            </div>
          </Show>
          <Show when={exifData()?.meteringMode}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Metering</span>
              <span class={classes.exifValue}>{exifData()?.meteringMode}</span>
            </div>
          </Show>
          <Show when={exifData()?.dateTime}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Date</span>
              <span class={classes.exifValue}>{exifData()?.dateTime}</span>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};

export default ExifData;
