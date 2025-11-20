import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schema/registerSchema";

export async function POST(request) {
    try {
        const body = await request.json();
        const data = registerSchema.parse(body);
        const created = await prisma.user.create({
            data
        })
        console.log(created);
        
        return NextResponse.json({
            status: "success",
            message: "Tạo tài khoản thành công"
        })
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            error: error.errors
        }, { status: 400 });
    }
}

