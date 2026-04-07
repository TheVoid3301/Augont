import { Elysia } from 'elysia';

export const responseWrapper = new Elysia({ name: 'response-wrapper' })
                                .onAfterHandle(({ response }) => {
                                    if (response && typeof response === 'object' && 'code' in response) {
                                    return response;
                                    }

                                    return {
                                    code: 200,
                                    data: response,
                                    message: 'success',
                                    success: true
                                    };
                                });