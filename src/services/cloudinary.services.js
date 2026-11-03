const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadBufferToCloudinary = (
  buffer,
  folder = "house-of-clothes/products",
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

const uploadUrlToCloudinary = async (
  url,
  folder = "house-of-clothes/products",
) => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload URL to Cloudinary: ${error.message}`);
  }
};

module.exports = {
  uploadBufferToCloudinary,
  uploadUrlToCloudinary,
};
