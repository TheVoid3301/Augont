import type { Prisma } from '../db/prisma/generated';
import type { FileMetadata } from '../../../domain/model/file';

export const mapUserFileToDomain = (record: Prisma.UserFileGetPayload<object>): FileMetadata => ({
  id: record.id,
  userId: record.userId,
  fileMd5: record.fileMd5,
  fileName: record.fileName,
  originalName: record.originalName,
  extension: record.extension,
  mimeType: record.mimeType,
  sizeBytes: record.sizeBytes,
  storagePath: record.storagePath,
  storageProvider: record.storageProvider,
  isDeleted: record.isDeleted,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  lastAccessedAt: record.lastAccessedAt
});
