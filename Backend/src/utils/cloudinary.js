import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // File has been uploaded successfully, remove the locally saved temporary file
        fs.unlinkSync(localFilePath); 
        
        // Return the secure URL and other response data
        return response;

    } catch (error) {
        // Remove the locally saved temporary file if the upload operation fails
        // Use fs.unlink (async) or fs.unlinkSync (sync)
        if (fs.existsSync(localFilePath)) {
             fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return false;
    try {
        const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
        return res?.result === 'ok' || res?.result === 'not found';
    } catch (e) {
        return false;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };