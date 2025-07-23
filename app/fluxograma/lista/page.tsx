"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ListaFluxogramasPage() {
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
              <h1 className="text-xl font-semibold">Fluxogramas</h1>
            </div>
            <Link href="/fluxograma">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Fluxograma
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Fluxogramas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">A listagem de fluxogramas será implementada em breve.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
