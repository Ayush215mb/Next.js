import {NextResponse} from "next/server";

export async function POST(){
    console.log("hello from the route server")
    return NextResponse.json({success:true})
}