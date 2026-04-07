import type { Prisma } from '../db/prisma/generated';
import { prisma } from '../db/prisma/client';
import type { CreateFileMetadataInput, FileMetadata } from '../../../domain/model/file';
import type { FileMetadataRepository } from '../../../domain/repository/file-metadata-repository';

const mapToDomain = (record: Prisma.UserFileGetPayload<object>): FileMetadata => ({
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

export class PrismaFileMetadataRepository implements FileMetadataRepository {
  async findByUserAndMd5(userId: string, fileMd5: string): Promise<FileMetadata | null> {
    const record = await prisma.userFile.findFirst({
      where: {
        userId,
        fileMd5,
        isDeleted: false
      }
    });

    return record ? mapToDomain(record) : null;
  }

  async findFirstByMd5(fileMd5: string): Promise<FileMetadata | null> {
    const record = await prisma.userFile.findFirst({
      where: {
        fileMd5,
        isDeleted: false
      }
    });

    return record ? mapToDomain(record) : null;
  }

  async findByIdAndUser(id: string, userId: string): Promise<FileMetadata | null> {
    const record = await prisma.userFile.findFirst({
      where: {
        id,
        userId,
        isDeleted: false
      }
    });

    return record ? mapToDomain(record) : null;
  }

  async create(input: CreateFileMetadataInput): Promise<FileMetadata> {
    const record = await prisma.userFile.create({
      data: {
        userId: input.userId,
        fileMd5: input.fileMd5,
        fileName: input.fileName,
        originalName: input.originalName,
        extension: input.extension,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        storagePath: input.storagePath,
        storageProvider: input.storageProvider,
        metadata: input.metadata
      }
    });

    return mapToDomain(record);
  }

  async touchLastAccessedAt(id: string): Promise<void> {
    await prisma.userFile.update({
      where: { id },
      data: {
        lastAccessedAt: new Date()
      }
    });
  }
}
