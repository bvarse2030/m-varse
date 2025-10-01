Act as a senior web developer, and you are working in NextJS with TypeScript. 

Here is an example of api and its response data.
api ``` http://localhost:3000/api/site-setting/private/v1 ```

here is example of controller for this route
controller.ts 
```
import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import About from './model'

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

// CREATE About
export async function createAbout(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const aboutData = await req.json()
            const newAbout = await About.create({
                ...aboutData,
            })
            return formatResponse(newAbout, 'About created successfully', 201)
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

// GET single About by ID
export async function getAboutById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id) return formatResponse(null, 'About ID is required', 400)

        const about = await About.findById(id)
        if (!about) return formatResponse(null, 'About not found', 404)

        return formatResponse(about, 'About fetched successfully', 200)
    })
}

// GET all Abouts with pagination and intelligent search
export async function getAbouts(req: Request): Promise<IResponse> {
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
                    'title',
                    'description',
                    'title1',
                    'description1',
                    'title2',
                    'description2',
                    'title3',
                    'description3',
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

        const abouts = await About.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalAbouts = await About.countDocuments(searchFilter)

        return formatResponse(
            {
                abouts: abouts || [],
                total: totalAbouts,
                page,
                limit,
            },
            'Abouts fetched successfully',
            200
        )
    })
}

// UPDATE single About by ID
export async function updateAbout(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedAbout = await About.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            })

            if (!updatedAbout)
                return formatResponse(null, 'About not found', 404)
            return formatResponse(
                updatedAbout,
                'About updated successfully',
                200
            )
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

// BULK UPDATE Abouts
export async function bulkUpdateAbouts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] =
            await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                About.findByIdAndUpdate(id, updateData, {
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

// DELETE single About by ID
export async function deleteAbout(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedAbout = await About.findByIdAndDelete(id)
        if (!deletedAbout) return formatResponse(null, 'About not found', 404)
        return formatResponse(
            { deletedCount: 1 },
            'About deleted successfully',
            200
        )
    })
}

// BULK DELETE Abouts
export async function bulkDeleteAbouts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await About.findById(id)
                if (doc) {
                    const deletedDoc = await About.findByIdAndDelete(id)
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

response data 
```
{
    "data": {
        "abouts": [
            {
                "_id": "68dd831c5f46dfc479102b6d",
                "title": "About Our-Company",
                "description": "Welcome to Our-Company, where we are passionate about revolutionizing the industry with our innovative solutions and unwavering commitment to our clients. We believe in building strong relationships and fostering a culture of creativity and excellence.",
                "images": [
                    "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                    "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                    "https://i.ibb.co.com/PGXYXwTq/img.jpg",
                    "https://i.ibb.co.com/PGXYXwTq/img.jpg"
                ],
                "title1": "Our Story: From a Simple Idea to a Thriving Business",
                "description1": "Our-Company was founded in a small garage by a group of friends who shared a common dream: to make a difference in the world through technology. What started as a passion project quickly grew into a full-fledged business, driven by our dedication to quality and our desire to create products that truly matter. We've overcome numerous challenges along the way, but our core values have remained the same: innovation, integrity, and a relentless focus on the customer. Today, we are proud to be a leading provider of cutting-edge solutions, serving clients from all corners of the globe.",
                "title2": "Our Mission: To Empower and Inspire",
                "description2": "Our mission is to empower businesses and individuals with the tools they need to succeed in a rapidly changing world. We strive to create intuitive, user-friendly products that not only solve complex problems but also inspire creativity and foster growth. We believe that technology should be a force for good, and we are committed to using our skills and expertise to make a positive impact on society. Every member of our team is dedicated to this mission, and we work tirelessly to ensure that our products and services exceed the expectations of our clients.",
                "title3": "Our Team: The Driving Force Behind Our Success",
                "description3": "At Our-Company, we believe that our team is our greatest asset. We are a diverse group of talented and passionate individuals who are united by a common goal: to create exceptional products that make a difference. We foster a collaborative and inclusive work environment where everyone feels valued and empowered to contribute their unique skills and perspectives. From our engineers and designers to our sales and support staff, every member of our team plays a crucial role in our success. We are proud of the work we do, and we are committed to providing our clients with the best possible experience.",
                "createdAt": "2025-10-01T19:38:04.155Z",
                "updatedAt": "2025-10-01T19:38:04.155Z",
                "__v": 0
            }
        ],
        "total": 1,
        "page": 1,
        "limit": 10
    },
    "message": "Abouts fetched successfully",
    "status": 200
}```



You have create two Page.
1. PrivatePage [SSR ]
    - in this please view the example data.


2. PrivatePageEditor
    - in this  I can edit PrivatePage data and revalidate the page.
    - after revalidate it will auto matic update the page.

Design Idea for this two 
1. Make it responsive for mobile and desktop.
2. Implement transition animation.

