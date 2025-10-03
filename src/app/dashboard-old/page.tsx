/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: M Varse, October, 2025
|-----------------------------------------
*/

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import PrivatePageEditor from '@/components/common/site-settings/private-pate/PrivatePageEditor'
import MenuEditorComponent from '@/components/common/site-settings/menu/MenuEditorComponent'
import RelavidatePrivatePage from './RelavidatePrivatePage'

const Page = () => {
    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
            <RelavidatePrivatePage />
            <Tabs defaultValue="menu" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="menu">Menu Settings</TabsTrigger>
                    <TabsTrigger value="PrivatePageEditor">
                        Private Page Editor
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="menu">
                    <Card>
                        <CardHeader>
                            <CardTitle>Menu Editor</CardTitle>
                            <CardDescription>
                                Update the navigation links for your website.
                                Changes will be reflected after revalidation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MenuEditorComponent />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="PrivatePageEditor">
                    <Card>
                        <CardHeader>
                            <CardTitle>Private Page Editor</CardTitle>
                            <CardDescription>
                                Upload and manage your site&lsquo;s
                                PrivatePageEditor.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PrivatePageEditor />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}
export default Page
