import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/AvatarUploader.module.css';

interface AvatarUploaderProps {
  avatarUrl?: string;
  onUpload: (file: File) => Promise<void>;
}

const AvatarUploader = ({ avatarUrl, onUpload }: AvatarUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(avatarUrl);
  }, [avatarUrl]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.preview}>
        {preview ? (
          <Image src={preview} alt="Avatar" width={96} height={96} className={styles.image} unoptimized />
        ) : (
          <div className={styles.placeholder}>Ảnh đại diện</div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className={styles.input}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={styles.button}
        disabled={uploading}
      >
        {uploading ? 'Đang tải...' : 'Tải ảnh đại diện'}
      </button>
    </div>
  );
};

export default AvatarUploader;
