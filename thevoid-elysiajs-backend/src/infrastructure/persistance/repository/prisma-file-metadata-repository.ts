import type { Prisma } from '../db/prisma/generated';
import { prisma } from '../db/prisma/client';
import type { CreateFileMetadataInput, FileMetadata } from '../../../domain/model/file';
import type { FileMetadataRepository } from '../../../domain/repository/file-metadata-repository';
import { mapUserFileToDomain } from '../mapper/user-file-mapper';

export class PrismaFileMetadataRepository implements FileMetadataRepository {
  async findByUserAndMd5(userId: string, fileMd5: string): Promise<FileMetadata | null> {
    const record = await prisma.userFile.findFirst({
      where: {
        userId,
        fileMd5,
        isDeleted: false
      }
    });

    return record ? mapUserFileToDomain(record) : null;
  }

  async findFirstByMd5(fileMd5: string): Promise<FileMetadata | null> {
    const record = await prisma.userFile.findFirst({
      where: {
        fileMd5,
        isDeleted: false
      }
    });

    return record ? mapUserFileToDomain(record) : null;
  }

  async findByIdAndUser(id: string, userId: string): Promise<FileMetadata | null> {
    const record = await prisma.userFile.findFirst({
      where: {
        id,
        userId,
        isDeleted: false
      }
    });

    return record ? mapUserFileToDomain(record) : null;
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
        metadata: input.metadata as Prisma.InputJsonValue
      }
    });

    return mapUserFileToDomain(record);
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
