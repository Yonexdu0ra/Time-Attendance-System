"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
// import { Icons } from "@/components/icons"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-lg text-center">
        <div className="flex items-center justify-center pt-8">
          {/* <Icons.logo className="h-14 w-14 text-muted-foreground" /> */}
        </div>

        <CardTitle className="text-3xl mt-4">404 — Page not found</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </CardDescription>
        <div className="flex justify-center gap-3 mt-6 pb-8">
          <Button asChild>
            <Link href="/">Go to homepage</Link>
          </Button>

          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:underline"
          >
            Contact support
          </Link>
        </div>
      </Card>
    </div>
  )
}
