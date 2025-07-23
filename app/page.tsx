import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Workflow, GitBranch, Building, Plus } from "lucide-react"
import { getValueChains } from "@/lib/database"

async function getStats() {
  try {
    const valueChains = await getValueChains()
    return {
      valueChains: valueChains.length,
      structures: 0, // Implementar quando tiver estruturas
      flowcharts: 0, // Implementar quando tiver fluxogramas
    }
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error)
    return {
      valueChains: 0,
      structures: 0,
      flowcharts: 0,
    }
  }
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/biz-ex-logo-RWbK5FqN7jquZTIC3kiOcAwVog33mG.png"
                alt="COMIGO Logo"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciador de Processos Empresariais</h1>
          <p className="text-gray-600">Crie e gerencie cadeias de valor, estruturas organizacionais e fluxogramas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cadeia de Valor */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-green-600" />
                Cadeia de Valor
              </CardTitle>
              <CardDescription>Crie e visualize cadeias de valor para seus processos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/cadeia-valor">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Cadeia
                  </Button>
                </Link>
                <Link href="/cadeia-valor/lista">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Cadeias Existentes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Estrutura */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Estrutura
              </CardTitle>
              <CardDescription>Defina estruturas organizacionais e hierarquias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/estrutura">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Estrutura
                  </Button>
                </Link>
                <Link href="/estrutura/lista">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Estruturas Existentes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Fluxograma */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-purple-600" />
                Fluxograma
              </CardTitle>
              <CardDescription>Desenhe fluxogramas de processos e workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/fluxograma">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Fluxograma
                  </Button>
                </Link>
                <Link href="/fluxograma/lista">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Fluxogramas Existentes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.valueChains}</div>
              <div className="text-sm text-gray-600">Cadeias de Valor</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.structures}</div>
              <div className="text-sm text-gray-600">Estruturas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.flowcharts}</div>
              <div className="text-sm text-gray-600">Fluxogramas</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
