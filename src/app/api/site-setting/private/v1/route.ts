import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getAbouts,
    createAbout,
    updateAbout,
    deleteAbout,
    getAboutById,
    bulkUpdateAbouts,
    bulkDeleteAbouts,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Abouts
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getAboutById(req)
        : await getAbouts(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE About
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createAbout(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE About
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateAbouts(req)
        : await updateAbout(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE About
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteAbouts(req)
        : await deleteAbout(req);

    return formatResponse(result.data, result.message, result.status);
}