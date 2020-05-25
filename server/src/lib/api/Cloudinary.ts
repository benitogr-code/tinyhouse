import cloudinary from "cloudinary";

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

export const Cloudinary = {
  upload: async (image: string) => {
    /* eslint-disable @typescript-eslint/camelcase */
    const res = await cloudinary.v2.uploader.upload(image, {
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      cloud_name: CLOUDINARY_NAME,
      folder: "THAssets_Dev",
    });
    /* eslint-enable @typescript-eslint/camelcase */

    return res.secure_url;
  }
};
