"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {postSchema} from "@/app/schemas/blog";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import React, {useTransition} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import z from "zod"
import {Loader2} from "lucide-react";
import {CreateBlogAction} from "@/app/action";

export default function CreateRoute() {

    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            content: "",
            image:undefined
        }
    })

    function onSubmit(values: z.infer<typeof postSchema>) {

        startTransition(async() => {

            await CreateBlogAction(values)

        })

    }

    return (
        <div className={"py-12"}>
            <div className={"text-center mb-12"}>
                <h1 className={"text-4xl font-semibold tracking-tight  sm:text-5xl  "}>Create Post</h1>
                <p className={"text-xl text-muted-foreground  pt-4 "}>Share what&apos;s on your mind...</p>
            </div>

            <Card className={"w-full max-w-xl mx-auto"}>
                <CardHeader>
                    <CardTitle className={"text-lg text-center"}>
                        Create a new blog article
                    </CardTitle>
                    {/*<CardDescription>*/}
                    {/*   */}
                    {/*</CardDescription>*/}
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className={"gap-y-4"}>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field>
                                        <FieldLabel>Title of the blog</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid}
                                               placeholder={"Met a stranger today"} {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="content"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field>
                                        <FieldLabel>Content</FieldLabel>
                                        <Textarea aria-invalid={fieldState.invalid}
                                                  placeholder={"met him/her while going to college"} {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="image"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field>
                                        <FieldLabel>Upload Image</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid}
                                               placeholder={"Met a stranger today"} type={"file"} accept={"image/*"} onChange={
                                            (event)=>{
                                                const file = event.target.files?.[0]
                                                field.onChange(file)
                                            }
                                        } />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}
                            />


                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className={"animate-spin size-4 "}/>
                                        <span>Creating...</span>
                                    </>
                                ) : (<span>Create Post</span>)}
                            </Button>
                        </FieldGroup>

                    </form>

                </CardContent>
            </Card>

        </div>
    )
}