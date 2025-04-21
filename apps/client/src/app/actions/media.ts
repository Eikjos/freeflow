"use server";

import { client } from "../../lib/client";

function generateFilenameFromBase64(base64: string): string {
  const mimeMatch = base64.match(/^data:(image\/[a-z]+);base64,/);
  const extension = mimeMatch ? mimeMatch[1]?.split("/")[1] : "png";
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `image-${timestamp}-${random}.${extension}`;
}

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0]?.match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]!);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const uploadImg = async (base64: string) => {
  const filename = generateFilenameFromBase64(base64);
  const file = base64ToFile(base64, filename);
  const formData = new FormData();
  formData.append("file", file);
  return await client<number>(
    "media",
    {
      method: "POST",
      body: formData,
    },
    "other"
  ).then((res) => {
    console.log("reponse", res);
    if (res.ok && res.data) {
      return res.data;
    }
    throw new Error(res.error);
  });
};
