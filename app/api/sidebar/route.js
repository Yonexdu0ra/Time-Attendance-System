import { auth } from "@/auth";
import { sidebar,adminSidebar } from "@/config/sidebar";
import { NextResponse } from "next/server";


export async function GET(request) {
    const session = await auth();
    console.log(session);
    
    if (!session || !session.user?.role !== "ADMIN") {
        return NextResponse.json(sidebar, { status: 200 });
    }
    return NextResponse.json(adminSidebar, { status: 200 });
}