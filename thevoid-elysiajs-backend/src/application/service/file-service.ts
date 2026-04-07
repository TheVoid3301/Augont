import { createHash } from 'node:crypto';
import { extname } from 'node:path';
import type { FileMetadata } from '../../domain/model/file';
import type { FileMetadataRepository } from '../../domain/repository/file-metadata-repository';
import { env } from '../../infrastructure/config/env';
import { LocalFileStorage } from '../../infrastructure/libs/storage/local-file-storage';

type UploadResult = {
  file: FileMetadata;
  deduplicated: boolean;
};

type UploadInput = {
  userId: string;
  originalName: string;
  mimeType: string;
  binary: Buffer;
};

export class FileService {
  constructor(
    private readonly fileRepository: FileMetadataRepository,
    private readonly fileStorage: LocalFileStorage
  ) {}

  async upload(input: UploadInput): Promise<UploadResult> {
    const maxBytes = env.UPLOAD_MAX_SIZE_MB * 1024 * 1024;
    if (input.binary.length > maxBytes) {
      throw new Error(`FILE_TOO_LARGE:${env.UPLOAD_MAX_SIZE_MB}`);
    }

    const fileMd5 = createHash('md5').update(input.binary).digest('hex');
    const sameUserFile = await this.fileRepository.findByUserAndMd5(input.userId, fileMd5);
    if (sameUserFile) {
      return {
        file: sameUserFile,
        deduplicated: true
      };
    }

    const normalizedExt = extname(input.originalName).replace('.', '').toLowerCase() || null;
    const fileName = normalizedExt ? `${fileMd5}.${normalizedExt}` : fileMd5;
    const relativePath = this.fileStorage.buildRelativePath(fileMd5, fileName);

    // Global storage deduplication: same MD5 reuses existing object file path.
    const anyExistingFile = await this.fileRepository.findFirstByMd5(fileMd5);
    const shouldWritePhysicalFile =
      !anyExistingFile || !(await this.fileStorage.exists(anyExistingFile.storagePath));

    if (shouldWritePhysicalFile) {
      await this.fileStorage.save(relativePath, input.binary);
    }

    const created = await this.fileRepository.create({
      userId: input.userId,
      fileMd5,
      fileName,
      originalName: input.originalName,
      extension: normalizedExt,
      mimeType: input.mimeType || 'application/octet-stream',
      sizeBytes: BigInt(input.binary.length),
      storagePath: shouldWritePhysicalFile ? relativePath : anyExistingFile!.storagePath,
      storageProvider: 'local',
      metadata: {
        deduplicatedByStorage: !shouldWritePhysicalFile
      }
    });

    return {
      file: created,
      deduplicated: !shouldWritePhysicalFile
    };
  }

  async getDownloadFile(id: string, userId: string): Promise<{ file: FileMetadata; absolutePath: string }> {
    const file = await this.fileRepository.findByIdAndUser(id, userId);
    if (!file) {
      throw new Error('FILE_NOT_FOUND');
    }

    const exists = await this.fileStorage.exists(file.storagePath);
    if (!exists) {
      throw new Error('FILE_STORAGE_MISSING');
    }

    await this.fileRepository.touchLastAccessedAt(file.id);
    return {
      file,
      absolutePath: this.fileStorage.getAbsolutePath(file.storagePath)
    };
  }
}
