'use client'

import React, {useTransition} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signUpSchema} from "@/app/schemas/auth";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import z from "zod";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

const SignUpPage = () => {

    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
        }
    })

    const router = useRouter();

    function onSubmit(data: z.infer<typeof signUpSchema>) {
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                name: data.name,
                password: data.password,

                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account Created Successfully");
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
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create an account to get started</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller name={"name"} control={form.control} render={({field, fieldState}) => (
                            <Field>
                                <FieldLabel>Full Name</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} placeholder={"John doe"} {...field} />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}/>

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
                                    <Loader2 size={4}/>
                                    <span>Creating ...</span>
                                </>
                            ) : (<span>Sign up</span>)}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
export default SignUpPage
