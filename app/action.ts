"use server"

import z from "zod"
import {postSchema} from "@/app/schemas/blog";
import {fetchMutation} from "convex/nextjs";
import {api} from "@/convex/_generated/api";
import {redirect} from "next/navigation";
import {getToken} from "@/lib/auth-server";
import {revalidatePath} from "next/cache";


export async function CreateBlogAction(values:  z.infer<typeof postSchema>) {

    try{
        const parsed =  postSchema.safeParse(values)

        if(!parsed.success){
            throw new Error("Failed to create blog")
        }
        const token = await getToken()

        const imageUrl = await fetchMutation(
            api.posts.generateImageUploadUrl,{},{token}
        )

        if(typeof imageUrl != "string"){
            throw new Error("Failed to upload image")
        }

        const uploadResult = await fetch(imageUrl,{
            method: "POST",
            headers:{
                "Content-Type": parsed.data.image.type,
            },
            body: parsed.data.image
        })

        if(!uploadResult.ok){
            throw new Error("Failed to upload image")
        }

        const {storageId}= await uploadResult.json()

        await fetchMutation(
            api.posts.CreatePost,{
                body: parsed.data.content,
                title: parsed.data.title,
                imageStorageId: storageId

            },
            {token}
        )


    }catch{
        return {
            error: "Failed to create blog"
        }
    }


    revalidatePath("/blog")
    return redirect("/blog")
}