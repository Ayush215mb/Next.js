"use client";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Loader2, MessageSquare} from "lucide-react";
import {Controller, useForm} from "react-hook-form";
import {commentSchema} from "@/app/schemas/comments";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field, FieldLabel} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "../ui/button";
import {useParams} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
import {Preloaded, useMutation, usePreloadedQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import z from "zod";
import {toast} from "sonner";
import {useTransition} from "react";
import {Avatar} from "@/components/ui/avatar";
import {AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {Separator} from "@radix-ui/react-dropdown-menu";


const CommentSection = (props:{ preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>}) => {


  const params = useParams<{ postId: Id<"posts"> }>();
  const data = usePreloadedQuery(props.preloadedComments)

  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.CreateComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment Created");
      } catch {
        toast.error("Failde tp create comment");
      }
    });
  }

  if (data === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row items-center border-b"}>
        <MessageSquare className={"size-5"} />
        <h2 className={"text-xl font-bold"}>{data.length} comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className={"space-y-4"} onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name={"body"}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts"
                  {...field}
                />
              </Field>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className={"animate-spin size-4 "} />
                <span>Posting..</span>
              </>
            ) : (
              <span>Comment</span>
            )}
          </Button>
        </form>

        {data?.length > 0 && <Separator />}

        <section className={"space-y-6"}>
          {data?.map((comment) => (
            <div key={comment._id} className={"flex gap-4"}>
              <Avatar className={"size-10 shrink-0"}>
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />

                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className={"flex-1 space-y-1"}>
                <div className="flex items-center justify-between ">
                  <p className={"font-semibold text-sm"}>
                    {comment.authorName}
                  </p>
                  <p className={"font-muted-foreground text-xs"}>
                    {new Date(comment._creationTime!).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-sm text-foreground/90 whitespace-nowrap ">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
};
export default CommentSection;
