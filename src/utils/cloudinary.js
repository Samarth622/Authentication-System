import {  v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dp9gcsdue',
    api_key: process.env.CLOUDINARY_API_KEY || '712441168487225',
    api_secret: process.env.CLOUDINARY_API_SECRET || '1i0u4yJMMwPr1eklayA44CuqO04',
});

export default cloudinary;