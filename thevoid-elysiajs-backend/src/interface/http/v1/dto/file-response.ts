import type { FileMetadata } from '../../../../domain/model/file';

export type FileResponse = {
  id: string;
  userId: string;
  fileMd5: string;
  fileName: string;
  originalName: string;
  extension: string | null;
  mimeType: string;
  sizeBytes: string;
  storagePath: string;
  storageProvider: string;
  createdAt: Date;
  updatedAt: Date;
};

export const toFileResponse = (record: FileMetadata): FileResponse => ({
  id: record.id,
  userId: record.userId,
  fileMd5: record.fileMd5,
  fileName: record.fileName,
  originalName: record.originalName,
  extension: record.extension,
  mimeType: record.mimeType,
  sizeBytes: record.sizeBytes.toString(),
  storagePath: record.storagePath,
  storageProvider: record.storageProvider,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt
});
