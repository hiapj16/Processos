"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { getValueChains } from "@/lib/database"

interface CadeiaData {
  id: string
  name: string
  title: string
  document?: {
    code: string
    revision: string
    date: string
    author: string
    approver: string
  }
  created_at: string
}

export default function ListaCadeiasPage() {
  const [cadeias, setCadeias] = useState<CadeiaData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCadeias()
  }, [])

  const loadCadeias = async () => {
    try {
      setLoading(true)
      const data = await getValueChains()
      setCadeias(data)
    } catch (error) {
      console.error("Erro ao carregar cadeias:", error)
      alert("Erro ao carregar cadeias do banco de dados")
    } finally {
      setLoading(false)
    }
  }

  const deleteCadeia = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta cadeia?")) {
      try {
        // Aqui você implementaria a função de deletar no Supabase
        // Por enquanto, vamos apenas remover da lista local
        setCadeias(cadeias.filter((c) => c.id !== id))
        alert("Cadeia excluída com sucesso!")
      } catch (error) {
        console.error("Erro ao excluir cadeia:", error)
        alert("Erro ao excluir cadeia")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-xl font-semibold">Cadeias de Valor</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando cadeias...</p>
          </div>
        </main>
      </div>
    )
  }

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
              <h1 className="text-xl font-semibold">Cadeias de Valor</h1>
            </div>
            <Link href="/cadeia-valor">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Cadeia
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cadeias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadeias.map((cadeia) => (
              <Card key={cadeia.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{cadeia.name}</CardTitle>
                    <Badge variant="secondary">{cadeia.document?.code || "N/A"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Revisão:</strong> {cadeia.document?.revision || "N/A"}
                    </p>
                    <p>
                      <strong>Data:</strong>{" "}
                      {cadeia.document?.date ? new Date(cadeia.document.date).toLocaleDateString("pt-BR") : "N/A"}
                    </p>
                    {cadeia.document?.author && (
                      <p>
                        <strong>Autor:</strong> {cadeia.document.author}
                      </p>
                    )}
                    <p>
                      <strong>Criado em:</strong> {new Date(cadeia.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/cadeia-valor?id=${cadeia.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/cadeia-valor?id=${cadeia.id}&edit=true`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => deleteCadeia(cadeia.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma cadeia de valor encontrada</p>
            <Link href="/cadeia-valor">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Cadeia
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
