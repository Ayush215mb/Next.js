"use client"

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema} from "@/app/schemas/auth";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useTransition} from "react";
import {authClient} from "@/lib/auth-client";
import z from "zod";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const router = useRouter();

    function onSubmit(data: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged in successfully");
                        router.push("/")
                    },
                    onError: (error) => {
                        toast.error(error.error.message);
                    },
                }
            })
        })

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Log iN</CardTitle>
                <CardDescription>Login to your account to get started</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">

                        <Controller name={"email"} control={form.control} render={({field, fieldState}) => (
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} placeholder={"john@gmail.com"}
                                       type={"email"} {...field} />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>

                        <Controller name={"password"} control={form.control} render={({field, fieldState}) => (
                            <Field>
                                <FieldLabel>Password</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} placeholder={"*****"}
                                       type={"password"} {...field} />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className={"animate-spin size-4 "}/>
                                    <span>Loading ...</span>
                                </>
                            ) : (<span>Login</span>)}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}