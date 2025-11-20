import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export const GET = async (req) => {
    const account = await prisma.account.findMany();
    console.log(account);
    return NextResponse.json({message: "This is a test endpoint"})
}