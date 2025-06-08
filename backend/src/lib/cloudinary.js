import { v2 as Cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

Cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});

export default Cloudinary;
