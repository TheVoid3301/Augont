import { Elysia } from 'elysia';
import { FileService } from '../../../../application/service/file-service';
import { fail, success } from '../../../../domain/shared/result';
import { auth } from '../../../../infrastructure/libs/auth';
import { LocalFileStorage } from '../../../../infrastructure/libs/storage/local-file-storage';
import { PrismaFileMetadataRepository } from '../../../../infrastructure/persistance/repository/prisma-file-metadata-repository';
import { toFileResponse } from '../dto/file-response';

const fileRepository = new PrismaFileMetadataRepository();
const localFileStorage = new LocalFileStorage();
const fileService = new FileService(fileRepository, localFileStorage);

const getUserIdFromSession = async (request: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: request.headers
  });
  return session?.user.id ?? null;
};

export const fileRouter = new Elysia({ prefix: '/file' })
  .post('/upload', async ({ request, set }) => {
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      set.status = 401;
      return fail(null, 'Unauthorized');
    }

    const formData = await request.formData();
    const rawFile = formData.get('file');

    if (!(rawFile instanceof File)) {
      set.status = 400;
      return fail(null, 'file field is required');
    }

    const uploaded = await fileService.upload({
      userId,
      originalName: rawFile.name,
      mimeType: rawFile.type || 'application/octet-stream',
      binary: Buffer.from(await rawFile.arrayBuffer())
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'UPLOAD_FAILED';
      return { error: message };
    });

    if ('error' in uploaded) {
      if (uploaded.error.startsWith('FILE_TOO_LARGE')) {
        set.status = 413;
        return fail(null, `File too large, max ${uploaded.error.split(':')[1]}MB`);
      }

      set.status = 400;
      return fail(null, uploaded.error);
    }

    return success({
      ...toFileResponse(uploaded.file),
      deduplicated: uploaded.deduplicated
    }, 'file uploaded');
  })
  .get('/download/:id', async ({ params, request, set }) => {
    const userId = await getUserIdFromSession(request);
    if (!userId) {
      set.status = 401;
      return fail(null, 'Unauthorized');
    }

    const downloadResult = await fileService.getDownloadFile(params.id, userId).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'DOWNLOAD_FAILED';
      return { error: message };
    });

    if ('error' in downloadResult) {
      if (downloadResult.error === 'FILE_NOT_FOUND') {
        set.status = 404;
        return fail(null, 'file not found');
      }

      if (downloadResult.error === 'FILE_STORAGE_MISSING') {
        set.status = 410;
        return fail(null, 'file exists in metadata but missing in storage');
      }

      set.status = 400;
      return fail(null, downloadResult.error);
    }

    const encodedName = encodeURIComponent(downloadResult.file.originalName);
    return new Response(Bun.file(downloadResult.absolutePath), {
      headers: {
        'Content-Type': downloadResult.file.mimeType,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedName}`
      }
    });
  });
