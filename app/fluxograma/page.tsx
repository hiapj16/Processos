"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch } from "lucide-react"
import Link from "next/link"

export default function FluxogramaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/biz-ex-logo-RWbK5FqN7jquZTIC3kiOcAwVog33mG.png"
                  alt="COMIGO Logo"
                  className="h-8"
                />
              </Link>
              <h1 className="text-xl font-semibold">FLUXOGRAMA</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Editor de Fluxograma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">O editor de fluxograma será implementado em breve.</p>
              <p className="text-sm text-gray-400">
                Esta funcionalidade incluirá criação de fluxogramas de processo com GoJS.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
