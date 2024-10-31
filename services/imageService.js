import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabaseUrl } from '../constants/index';

// Function to generate a Supabase file URL based on the file path
export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
  }
  return null;
};

// Function to get user's image or a default image
export const getUserImageSrc = (imagePath) => {
  const fileUrl = getSupabaseFileUrl(imagePath);
  if (fileUrl) {
    return { uri: fileUrl };
  } else {
    return require('../assets/images/defaultUser.png'); // Path to the default image in assets
  }
};

// Function to upload an image
export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    const fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    const imageData = decode(fileBase64);

    const { data, error } = await supabase
      .storage
      .from('uploads') // Assuming your bucket is named 'uploads'
      .upload(fileName, imageData, {
        contentType: isImage ? 'image/png' : 'video/mp4',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.log('File Upload error: ', error);
      return { success: false, msg: "Could not upload media" };
    }

    console.log('Uploaded data path: ', data.path);
    return { success: true, data: data.path };

  } catch (error) {
    console.log('File Upload error: ', error);
    return { success: false, msg: "Could not upload media" };
  }
};

// Function to generate a unique file path
export const getFilePath = (folderName, isImage) => {
  return `${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
};
