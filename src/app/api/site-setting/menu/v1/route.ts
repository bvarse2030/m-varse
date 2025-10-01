import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenuById,
    bulkUpdateMenus,
    bulkDeleteMenus,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Menus
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getMenuById(req)
        : await getMenus(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Menu
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createMenu(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Menu
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateMenus(req)
        : await updateMenu(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Menu
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteMenus(req)
        : await deleteMenu(req);

    return formatResponse(result.data, result.message, result.status);
}