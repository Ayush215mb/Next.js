import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import {fetchQuery, preloadQuery} from "convex/nextjs";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {Separator} from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import {Metadata} from "next";

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export async function generateMetadata({params}: PostIdRouteProps): Promise<Metadata> {
  const {postId}= await params

  const post = await fetchQuery(api.posts.getPostsById,{postId})

  if(!post){
    return {
      title:"Posts not found"
    }
  }

  return {
    title:post.title,
    description: post.body
  }

}


export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;


  const [post, preloadedComments ] = await Promise.all([
      await fetchQuery(api.posts.getPostsById, { postId: postId }),
      await preloadQuery(api.comments.getCommentsByPostId,{
    postId: postId
  })
])



  if (!post) {
    return (
      <div className={"text-center justify-center items-center"}>
        <h1 className={"text-red-500 text-xl"}> No post found</h1>
      </div>
    );
  }

  return (
    <div
      className={
        "max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative "
      }
    >
      <Link
        href={"/blog"}
        className={buttonVariants({
          className: "mb-4",
        })}
      >
        <ArrowLeft className={"size-4"} />
        Back to Blog
      </Link>

      <div
        className={
          "relative w-full h-100  mb-8 rounded-xl overflow-hidden shadow-sm  "
        }
      >
        <Image
          src={
            post.imageUrl ??
            "https://plus.unsplash.com/premium_photo-1733864775776-481ca1dec3a9?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={post.title ?? "image"}
          className={
            "object-cover hover:scale-105 transition-transform duration-500  "
          }
          fill
        />
      </div>

      <div className={"space-y-4 flex flex-col"}>
        <h1 className={"text-4xl font-bold tracking-tight text-foreground  "}>
          {post.title}
        </h1>

        <p className={"text-sm text-muted-foreground"}>
          Posted on: {new Date(post._creationTime!).toLocaleDateString()}
        </p>
      </div>

      <Separator className={"my-8"} />
      <p className={"text-lg leading-relaxed text-foreground/90  "}>
        {post.body}
      </p>
      <Separator className={"my-8"} />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
