import { v2 as cloudinary } from 'cloudinary';
import formidable, { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable body parsing for the API route
export const dynamic = 'force-dynamic'; // Or use 'force-static' depending on your use case

const uploadImage = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Image upload failed' });
      return;
    }

    // Check if files.file exists and is an array with at least one element
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath);
      res.status(200).json({ url: result.secure_url });
    } catch (uploadError) {
      const errorMessage = (uploadError as { message?: string }).message || 'Upload failed';
      res.status(500).json({ error: errorMessage });
    }
  });
};

// Export the uploadImage function as default
export default uploadImage;
