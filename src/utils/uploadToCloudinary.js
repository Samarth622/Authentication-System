import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = async (fileBuffer) => {
  return await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "avatars" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(fileBuffer);
  });
};
