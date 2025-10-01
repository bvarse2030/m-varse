Act as a senior web developer, and you are working in NextJS with TypeScript. 

Here is an example of api and its response data.
api ``` http://localhost:3000/api/site-setting/menu/v1 ```

here is example of controller for this route
controller.ts 
```
import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Menu from './model'

interface IResponse {
    data: unknown
    message: string
    status: number
}

// Helper to format responses
const formatResponse = (
    data: unknown,
    message: string,
    status: number
): IResponse => ({
    data,
    message,
    status,
})

// CREATE Menu
export async function createMenu(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const menuData = await req.json()
            const newMenu = await Menu.create({
                ...menuData,
            })
            return formatResponse(newMenu, 'Menu created successfully', 201)
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// GET single Menu by ID
export async function getMenuById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id) return formatResponse(null, 'Menu ID is required', 400)

        const menu = await Menu.findById(id)
        if (!menu) return formatResponse(null, 'Menu not found', 404)

        return formatResponse(menu, 'Menu fetched successfully', 200)
    })
}

// GET all Menus with pagination and intelligent search
export async function getMenus(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1', 10)
        const limit = parseInt(url.searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit
        const searchQuery = url.searchParams.get('q')

        let searchFilter: FilterQuery<unknown> = {}

        if (searchQuery) {
            // Check for date range filter format first
            if (searchQuery.startsWith('createdAt:range:')) {
                const datePart = searchQuery.split(':')[2]
                const [startDateString, endDateString] = datePart.split('_')

                if (startDateString && endDateString) {
                    const startDate = new Date(startDateString)
                    const endDate = new Date(endDateString)
                    // To ensure the range is inclusive, set the time to the end of the day
                    endDate.setUTCHours(23, 59, 59, 999)

                    searchFilter = {
                        createdAt: {
                            $gte: startDate, // Greater than or equal to the start date
                            $lte: endDate, // Less than or equal to the end date
                        },
                    }
                }
            } else {
                // Fallback to original generic search logic
                const orConditions: FilterQuery<unknown>[] = []

                // Add regex search conditions for all string-like fields
                const stringFields = [
                    'home',
                    'about',
                    'contact',
                    'dashboard',
                    'private',
                    'public',
                    'privacyPolicy',
                    'termsAndCondition',
                ]
                stringFields.forEach((field) => {
                    orConditions.push({
                        [field]: { $regex: searchQuery, $options: 'i' },
                    })
                })

                // If the query is a valid number, add equality checks for all number fields
                const numericQuery = parseFloat(searchQuery)
                if (!isNaN(numericQuery)) {
                    const numberFields: string[] = []
                    numberFields.forEach((field) => {
                        orConditions.push({ [field]: numericQuery })
                    })
                }

                if (orConditions.length > 0) {
                    searchFilter = { $or: orConditions }
                }
            }
        }

        const menus = await Menu.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalMenus = await Menu.countDocuments(searchFilter)

        return formatResponse(
            {
                menus: menus || [],
                total: totalMenus,
                page,
                limit,
            },
            'Menus fetched successfully',
            200
        )
    })
}

// UPDATE single Menu by ID
export async function updateMenu(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            })

            if (!updatedMenu) return formatResponse(null, 'Menu not found', 404)
            return formatResponse(updatedMenu, 'Menu updated successfully', 200)
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// BULK UPDATE Menus
export async function bulkUpdateMenus(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] =
            await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Menu.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                })
            )
        )

        const successfulUpdates = results
            .filter(
                (r): r is PromiseFulfilledResult<unknown> =>
                    r.status === 'fulfilled' && r.value
            )
            .map((r) => r.value)

        const failedUpdates = results
            .map((r, i) =>
                r.status === 'rejected' || !('value' in r && r.value)
                    ? updates[i].id
                    : null
            )
            .filter((id): id is string => id !== null)

        return formatResponse(
            { updated: successfulUpdates, failed: failedUpdates },
            'Bulk update completed',
            200
        )
    })
}

// DELETE single Menu by ID
export async function deleteMenu(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedMenu = await Menu.findByIdAndDelete(id)
        if (!deletedMenu) return formatResponse(null, 'Menu not found', 404)
        return formatResponse(
            { deletedCount: 1 },
            'Menu deleted successfully',
            200
        )
    })
}

// BULK DELETE Menus
export async function bulkDeleteMenus(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Menu.findById(id)
                if (doc) {
                    const deletedDoc = await Menu.findByIdAndDelete(id)
                    if (deletedDoc) {
                        deletedIds.push(id)
                    }
                } else {
                    invalidIds.push(id)
                }
            } catch {
                invalidIds.push(id)
            }
        }

        return formatResponse(
            { deleted: deletedIds.length, deletedIds, invalidIds },
            'Bulk delete operation completed',
            200
        )
    })
}

```

response date from this api.
```
{
    "data": {
        "menus": [
            {
                "_id": "68dd750573a213ec5ac7bf7a",
                "home": "/",
                "about": "/about",
                "contact": "/contact",
                "dashboard": "/dashboard",
                "private": "/private",
                "public": "/public",
                "privacyPolicy": "/privacy-policy",
                "termsAndCondition": "/terms-and-condition",
                "createdAt": "2025-10-01T18:37:57.714Z",
                "updatedAt": "2025-10-01T18:37:57.714Z",
                "__v": 0
            }
        ],
        "total": 1,
        "page": 1,
        "limit": 10
    },
    "message": "Menus fetched successfully",
    "status": 200
}```

You have create two component.
1. MenuComponent [SSR component]
    - in this component please create some NextJS Link, like home, about, contact, and so on.
    - this component is only render when we revalidate it form dashboard.
    - in desktop it will show all button
    - in mobile it will only show name or logo and right side it show a hamberger icon.
    - after click mangerger menu it show varticaly all item (menu).
    - after click menu it will close the menu and redirect to the path.


2. MenuEditorComponent
    - in this component I can edit menu and revalidate menu.
    - after revalidate it will auto matic update the menu.

Design Idea for this two component
1. Make it responsive for mobile and desktop.
2. Implement transition animation.

