import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values"
import {authComponent} from "./auth";

export const CreatePost = mutation({
    args: {title: v.string(), body: v.string(), imageStorageId: v.id("_storage")},

    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx)

        if (!user) {
            return new ConvexError("Not Authenticated")
        }

        const blogArticle = await ctx.db.insert('posts', {
            body: args.body,
            title: args.title,
            authorId: user._id,
            imageStorageId: args.imageStorageId
        })

        return blogArticle
    }
})

export const getPosts= query({
    args:{},
    handler: async(ctx)=>{
       const posts= await ctx.db.query("posts").order("desc").collect()

        return await Promise.all(
            posts.map(async (post)=>{
                const resolvedImageUrl= post.imageStorageId!== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null

                return {
                    ...post,
                    imageUrl: resolvedImageUrl
                }

            })
        )
    }
})

export const generateImageUploadUrl= mutation({
    args:{},
    handler: async (ctx)=>{
        const user = await authComponent.safeGetAuthUser(ctx)

        if (!user) {
            return new ConvexError("Not Authenticated")
        }
        return await ctx.storage.generateUploadUrl();
    }
})


export const getPostsById = query({

    args:{
        postId: v.id("posts"),
    },
    handler: async (ctx, args)=>{
        const post = await ctx.db.get(args.postId);

        const resolvedImageUrl= post?.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null

        return {
            ...post,
            imageUrl: resolvedImageUrl
        }

    }


})