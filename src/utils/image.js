// Resizes and compresses an uploaded image before it's turned into a
// base64 string. Profile photos are stored directly in localStorage in
// this demo (there's no backend/file storage yet), so keeping the encoded
// size small matters - an uncompressed phone photo can easily blow past
// localStorage's ~5MB limit on its own.
export function fileToCompressedDataUrl(file, { maxDimension = 480, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read that file."));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("That doesn't look like a valid image."));

      image.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}