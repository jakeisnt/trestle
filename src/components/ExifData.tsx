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
  software?: string;
  copyright?: string;
}

interface ExifDataProps {
  imageUrl: string;
}

/**
 * Component to display EXIF data from an image.
 */
const ExifData = (props: ExifDataProps) => {
  const [exifData, setExifData] = createSignal<ExifData | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(() => {
    if (!props.imageUrl) return;

    setLoading(true);
    setError(null);

    // Load the image and extract EXIF data
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        // Import EXIF library dynamically
        import("exif-js").then((EXIF) => {
          EXIF.getData(img, () => {
            const data: ExifData = {};
            
            // Extract common EXIF fields
            const make = EXIF.getTag(img, "Make") as string;
            const model = EXIF.getTag(img, "Model") as string;
            const aperture = EXIF.getTag(img, "FNumber") as number;
            const shutterSpeed = EXIF.getTag(img, "ExposureTime") as number;
            const iso = EXIF.getTag(img, "ISOSpeedRatings") as number;
            const focalLength = EXIF.getTag(img, "FocalLength") as number;
            const dateTime = EXIF.getTag(img, "DateTime") as string;
            const exposureMode = EXIF.getTag(img, "ExposureMode") as number;
            const whiteBalance = EXIF.getTag(img, "WhiteBalance") as number;
            const flash = EXIF.getTag(img, "Flash") as number;
            const meteringMode = EXIF.getTag(img, "MeteringMode") as number;
            const lensModel = EXIF.getTag(img, "LensModel") as string;
            const software = EXIF.getTag(img, "Software") as string;
            const copyright = EXIF.getTag(img, "Copyright") as string;

            // Format the data
            if (make) data.make = make;
            if (model) data.model = model;
            if (aperture) data.aperture = `f/${aperture}`;
            if (shutterSpeed) {
              if (shutterSpeed < 1) {
                data.shutterSpeed = `1/${Math.round(1 / shutterSpeed)}s`;
              } else {
                data.shutterSpeed = `${shutterSpeed}s`;
              }
            }
            if (iso) data.iso = `ISO ${iso}`;
            if (focalLength) data.focalLength = `${focalLength}mm`;
            if (dateTime) data.dateTime = dateTime;
            if (exposureMode) {
              const modes = ["Auto", "Manual", "Auto bracket"];
              data.exposureMode = modes[exposureMode - 1] || "Unknown";
            }
            if (whiteBalance) {
              const wbModes = ["Auto", "Manual"];
              data.whiteBalance = wbModes[whiteBalance - 1] || "Unknown";
            }
            if (flash) {
              const flashModes = ["No Flash", "Fired", "Fired, Return not detected", "Fired, Return detected"];
              data.flash = flashModes[flash] || "Unknown";
            }
            if (meteringMode) {
              const meteringModes = ["Unknown", "Average", "CenterWeightedAverage", "Spot", "MultiSpot", "Pattern", "Partial"];
              data.meteringMode = meteringModes[meteringMode] || "Unknown";
            }
            if (lensModel) data.lensModel = lensModel;
            if (software) data.software = software;
            if (copyright) data.copyright = copyright;

            setExifData(data);
            setLoading(false);
          });
        }).catch((err) => {
          console.error("Failed to load EXIF library:", err);
          setError("Failed to load EXIF data");
          setLoading(false);
        });
      } catch (err) {
        console.error("Error extracting EXIF data:", err);
        setError("Failed to extract EXIF data");
        setLoading(false);
      }
    };

    img.onerror = () => {
      setError("Failed to load image (CORS or network error)");
      setLoading(false);
    };

    img.src = props.imageUrl;
  });

  return (
    <div class={classes.exifContainer}>
      <h4 class={classes.exifTitle}>EXIF Data</h4>
      
      <Show when={loading()}>
        <div class={classes.exifLoading}>Loading EXIF data...</div>
      </Show>

      <Show when={error()}>
        <div class={classes.exifError}>{error()}</div>
      </Show>

      <Show when={exifData() && !loading() && !error()}>
        <div class={classes.exifData}>
          <Show when={exifData()?.make || exifData()?.model}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Camera:</span>
              <span class={classes.exifValue}>
                {[exifData()?.make, exifData()?.model].filter(Boolean).join(" ")}
              </span>
            </div>
          </Show>

          <Show when={exifData()?.lensModel}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Lens:</span>
              <span class={classes.exifValue}>{exifData()?.lensModel}</span>
            </div>
          </Show>

          <Show when={exifData()?.aperture}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Aperture:</span>
              <span class={classes.exifValue}>{exifData()?.aperture}</span>
            </div>
          </Show>

          <Show when={exifData()?.shutterSpeed}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Shutter Speed:</span>
              <span class={classes.exifValue}>{exifData()?.shutterSpeed}</span>
            </div>
          </Show>

          <Show when={exifData()?.iso}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>ISO:</span>
              <span class={classes.exifValue}>{exifData()?.iso}</span>
            </div>
          </Show>

          <Show when={exifData()?.focalLength}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Focal Length:</span>
              <span class={classes.exifValue}>{exifData()?.focalLength}</span>
            </div>
          </Show>

          <Show when={exifData()?.exposureMode}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Exposure Mode:</span>
              <span class={classes.exifValue}>{exifData()?.exposureMode}</span>
            </div>
          </Show>

          <Show when={exifData()?.whiteBalance}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>White Balance:</span>
              <span class={classes.exifValue}>{exifData()?.whiteBalance}</span>
            </div>
          </Show>

          <Show when={exifData()?.flash}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Flash:</span>
              <span class={classes.exifValue}>{exifData()?.flash}</span>
            </div>
          </Show>

          <Show when={exifData()?.meteringMode}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Metering Mode:</span>
              <span class={classes.exifValue}>{exifData()?.meteringMode}</span>
            </div>
          </Show>

          <Show when={exifData()?.dateTime}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Date Taken:</span>
              <span class={classes.exifValue}>{exifData()?.dateTime}</span>
            </div>
          </Show>

          <Show when={exifData()?.software}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Software:</span>
              <span class={classes.exifValue}>{exifData()?.software}</span>
            </div>
          </Show>

          <Show when={exifData()?.copyright}>
            <div class={classes.exifRow}>
              <span class={classes.exifLabel}>Copyright:</span>
              <span class={classes.exifValue}>{exifData()?.copyright}</span>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={!exifData() && !loading() && !error()}>
        <div class={classes.exifNoData}>No EXIF data available</div>
      </Show>
    </div>
  );
};

export default ExifData;
