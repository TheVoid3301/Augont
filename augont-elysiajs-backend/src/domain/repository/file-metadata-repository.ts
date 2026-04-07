import type { CreateFileMetadataInput, FileMetadata } from '../model/file';

export interface FileMetadataRepository {
  findByUserAndMd5(userId: string, fileMd5: string): Promise<FileMetadata | null>;
  findFirstByMd5(fileMd5: string): Promise<FileMetadata | null>;
  findByIdAndUser(id: string, userId: string): Promise<FileMetadata | null>;
  create(input: CreateFileMetadataInput): Promise<FileMetadata>;
  touchLastAccessedAt(id: string): Promise<void>;
}
