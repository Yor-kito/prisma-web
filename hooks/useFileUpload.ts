import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface UseFileUploadReturn {
    uploadFile: (file: File, path: string) => Promise<string>;
    progress: number;
    error: string | null;
    isUploading: boolean;
}

export function useFileUpload(): UseFileUploadReturn {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (file: File, path: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setIsUploading(true);
            setError(null);

            const storageRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(p);
                },
                (error) => {
                    setError(error.message);
                    setIsUploading(false);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setIsUploading(false);
                        resolve(downloadURL);
                    } catch (err) {
                        setError("Failed to get download URL");
                        setIsUploading(false);
                        reject(err);
                    }
                }
            );
        });
    };

    return { uploadFile, progress, error, isUploading };
}
