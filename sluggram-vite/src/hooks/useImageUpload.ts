import { useState } from 'react';
import { useNostr } from '../contexts/NostrContext';
import { createNip98AuthEvent, encodeNip98Auth } from '../lib/nostr';

const UPLOAD_URL = 'https://nostr.build/api/v2/upload/files';

interface UploadResult {
  url: string;
  dimensions?: { width: number; height: number };
  blurhash?: string;
}

export function useImageUpload() {
  const { publicKey, privateKey } = useNostr();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    if (!publicKey || !privateKey) {
      setError('Not authenticated');
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create NIP-98 auth header
      const authEvent = createNip98AuthEvent(
        privateKey,
        publicKey,
        UPLOAD_URL,
        'POST'
      );
      const authHeader = `Nostr ${encodeNip98Auth(authEvent)}`;

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      // nostr.build returns the URL in the response
      if (result.status === 'success' && result.data?.[0]?.url) {
        return {
          url: result.data[0].url,
          dimensions: result.data[0].dimensions,
          blurhash: result.data[0].blurhash,
        };
      }

      throw new Error('Invalid response from upload server');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      setError(message);
      console.error('Upload error:', e);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
}
