export type FileMetadata = {
  id: string;
  userId: string;
  fileMd5: string;
  fileName: string;
  originalName: string;
  extension: string | null;
  mimeType: string;
  sizeBytes: bigint;
  storagePath: string;
  storageProvider: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date | null;
};

export type CreateFileMetadataInput = {
  userId: string;
  fileMd5: string;
  fileName: string;
  originalName: string;
  extension: string | null;
  mimeType: string;
  sizeBytes: bigint;
  storagePath: string;
  storageProvider: string;
  metadata?: Record<string, unknown>;
};
