import { ExifParserFactory } from "ts-exif-parser";
// import exifr from "exifr";

/**
 * Convert a data URL to an ArrayBuffer.
 */
const dataUrlToArrayBuffer = (dataUrl: string) => {
  console.log("Parsing image from data URL");

  // Convert the base64 string to a binary buffer
  const base64Data = dataUrl.split(",")[1];
  const binaryStr = atob(base64Data);
  const len = binaryStr.length;
  const arrayBuffer = new ArrayBuffer(len);
  const view = new Uint8Array(arrayBuffer);

  for (let i = 0; i < len; i++) {
    view[i] = binaryStr.charCodeAt(i);
  }

  return arrayBuffer;
};

/**
 * Extract the EXIF fields from an ArrayBuffer.
 */
const extractEXIFFields = (buffer: ArrayBuffer) => {
  const parser = ExifParserFactory.create(buffer);
  parser.enableBinaryFields(true);
  parser.enablePointers(true);

  let exifData = parser.parse();

  // Extract relevant metadata (e.g., make and model)
  const make = exifData.tags?.Make || "Unknown";
  const model = exifData.tags?.Model || "Unknown";

  return { make, model };
};

/**
 * Determine if an array buffer contains a valid JPEG.
 */
const isValidJpeg = (buf: ArrayBuffer) => {
  const dataView = new DataView(buf);
  const firstByte = dataView.getUint8(0);
  if (firstByte !== 0xff) {
    return false;
  }

  const secondByte = dataView.getUint8(1);
  if (secondByte !== 0xd8) {
    return false;
  }

  return true;
};

/**
 * Get the metadata of a photo.
 */
const getPhotoMetadata = async (imgRef: HTMLImageElement) => {
  return new Promise((resolve, reject) => resolve({ make: "Unknown", model: "Unknown" }));

  //   const img = await window.fetch(imgRef.src, { cache: "no-store" });
  //   const arrayBuffer = await img.arrayBuffer();

  //   if (!isValidJpeg(arrayBuffer)) {
  //     throw new Error("Invalid JPEG");
  //   }

  //   return extractEXIFFields(arrayBuffer);
};

export { getPhotoMetadata };
