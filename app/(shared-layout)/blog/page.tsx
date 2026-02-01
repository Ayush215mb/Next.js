import {api} from "@/convex/_generated/api";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {fetchQuery} from "convex/nextjs";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image"

export default async function BlogPage(){

    return (
      <div className={"py-12"}>
        <div className={"text-center pb-12"}>
            <h1 className={"text-4xl font-extrabold tracking-tight sm:text-5xl "}>Our Blog</h1>
                <p className={"pt-4 max-w-4xl mx-auto text-xl text-muted-foreground "}>Insights, thoughts and trends from our team</p>
        </div>
          <Suspense fallback={<Skeletonloadingfallback/>}>
              <LoadBlogPost/>
          </Suspense>
      </div>
    )
}
async function LoadBlogPost(){
    const data= await fetchQuery(api.posts.getPosts)

    return (
        <div className={"grid gap-6 md:grid-cols-2 lg:grid:cols-3  "}>
            {data?.map((post)=>(
                <Card key={post._id} className={"p-0 "}>
                    <div className={"h-48 w-full overflow-hidden relative"}>
                        <Image src={post.imageUrl ?? "https://plus.unsplash.com/premium_photo-1733864775776-481ca1dec3a9?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={"image"} fill className={"rounded-t-lg object-cover"} />
                    </div>

                    <CardContent className={"py-2"}>
                        <Link href={`/blog/${post._id}`} >
                            <h1 className={"text-2xl font-bold hover:text-primary"}>{post.title}</h1>

                        </Link>
                        <p className={"text-muted-foreground text-wrap max-w-20  leading-tight "}>{post.body}
                            {post.body}
                        </p>
                    </CardContent>

                    <CardFooter>
                        <Link className={buttonVariants({
                            className: "w-full"
                        })} href={`/blog/${post._id}`} >
                            Read more
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

function Skeletonloadingfallback(){
    return (
        <div className={"grid gap-6 md:grid-cols-2 lg:grid:cols-3  "}>
            {[...Array(3)].map((_, i) =>
                <div className={"flex flex-col space-y-3"} key={i}>
                    <Skeleton className={"h-48 w-full rounded-xl"} />
                    <div className={"space-y-2 flex flex-col"}>
                        <Skeleton className={"h-6 w-3/4"}></Skeleton>
                        <Skeleton className={"h-4 w-full"}></Skeleton>
                        <Skeleton className={"h-4 w-2/3"}></Skeleton>
                    </div>
                </div>)
            }
        </div>
    )
}