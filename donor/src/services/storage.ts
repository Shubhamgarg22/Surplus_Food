import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., "donations/image.jpg")
 * @returns The download URL of the uploaded file
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Upload a donation image
 * @param file - The image file
 * @param donorId - The donor's ID
 * @returns The download URL
 */
export const uploadDonationImage = async (
  file: File,
  donorId: string
): Promise<string> => {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop();
  const path = `donations/${donorId}/${timestamp}.${extension}`;
  return uploadImage(file, path);
};

/**
 * Upload a profile image
 * @param file - The image file
 * @param userId - The user's ID
 * @returns The download URL
 */
export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<string> => {
  const extension = file.name.split(".").pop();
  const path = `profiles/${userId}/avatar.${extension}`;
  return uploadImage(file, path);
};

/**
 * Delete an image from Firebase Storage
 * @param url - The download URL of the image to delete
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Ignore error if file doesn't exist
  }
};

/**
 * Compress image before upload (optional optimization)
 * @param file - The original file
 * @param maxWidth - Maximum width
 * @param quality - JPEG quality (0-1)
 * @returns Compressed file
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
    };
  });
};
