"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Download, Info, Trash2, Edit, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createValueChain, getValueChains, getValueChainWithDetails } from "@/lib/database"

interface CadeiaNode {
  id: string
  text: string
  description?: string
  isEmpty: boolean
}

interface CadeiaRow {
  id: string
  nodes: CadeiaNode[]
}

interface CadeiaData {
  id?: string
  name: string
  title: string
  rows: CadeiaRow[]
  documentInfo: {
    code: string
    revision: string
    date: string
    author: string
    approver: string
  }
}

export default function CadeiaValorPage() {
  const [cadeias, setCadeias] = useState<CadeiaData[]>([])
  const [currentCadeia, setCurrentCadeia] = useState<CadeiaData | null>(null)
  const [selectedNode, setSelectedNode] = useState<CadeiaNode | null>(null)
  const [selectedRow, setSelectedRow] = useState<CadeiaRow | null>(null)
  const [isNewCadeiaOpen, setIsNewCadeiaOpen] = useState(false)
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Carregar cadeias do Supabase
  useEffect(() => {
    loadCadeias()
  }, [])

  const loadCadeias = async () => {
    try {
      setLoading(true)
      const data = await getValueChains()

      // Converter dados do Supabase para o formato esperado
      const formattedCadeias = data.map((chain: any) => ({
        id: chain.id,
        name: chain.name,
        title: chain.title,
        rows: [], // Será carregado quando necessário
        documentInfo: {
          code: chain.document?.code || "",
          revision: chain.document?.revision || "01",
          date: chain.document?.date || "",
          author: chain.document?.author || "",
          approver: chain.document?.approver || "",
        },
      }))

      setCadeias(formattedCadeias)
    } catch (error) {
      console.error("Erro ao carregar cadeias:", error)
      alert("Erro ao carregar cadeias do banco de dados")
    } finally {
      setLoading(false)
    }
  }

  const createNewCadeia = async (formData: FormData) => {
    try {
      setLoading(true)
      const name = formData.get("name") as string
      const nodeCount = Number.parseInt(formData.get("nodeCount") as string) || 3

      const cadeiaData = {
        name,
        title: name.toUpperCase(),
        documentInfo: {
          code: (formData.get("code") as string) || "CV-PA-01",
          revision: (formData.get("revision") as string) || "01",
          date: (formData.get("date") as string) || new Date().toISOString().split("T")[0],
          author: (formData.get("author") as string) || "",
          approver: (formData.get("approver") as string) || "",
        },
      }

      const result = await createValueChain(cadeiaData)

      // Criar cadeia local com estrutura inicial
      const newCadeia: CadeiaData = {
        id: result.valueChain.id,
        name: cadeiaData.name,
        title: cadeiaData.title,
        rows: [
          {
            id: "row-1",
            nodes: Array.from({ length: nodeCount }, (_, i) => ({
              id: `node-1-${i + 1}`,
              text: "",
              isEmpty: true,
            })),
          },
        ],
        documentInfo: cadeiaData.documentInfo,
      }

      setCurrentCadeia(newCadeia)
      setIsNewCadeiaOpen(false)

      // Recarregar lista de cadeias
      await loadCadeias()

      alert("Cadeia criada com sucesso!")
    } catch (error) {
      console.error("Erro ao criar cadeia:", error)
      alert("Erro ao criar cadeia no banco de dados")
    } finally {
      setLoading(false)
    }
  }

  const loadCadeiaDetails = async (cadeiaId: string) => {
    try {
      setLoading(true)
      const data = await getValueChainWithDetails(cadeiaId)

      // Converter dados do Supabase para o formato esperado
      const formattedCadeia: CadeiaData = {
        id: data.id,
        name: data.name,
        title: data.title,
        rows:
          data.rows?.map((row: any) => ({
            id: row.id,
            nodes:
              row.nodes?.map((node: any) => ({
                id: node.id,
                text: node.text || "",
                description: node.description || "",
                isEmpty: node.is_empty,
              })) || [],
          })) || [],
        documentInfo: {
          code: data.document?.code || "",
          revision: data.document?.revision || "01",
          date: data.document?.date || "",
          author: data.document?.author || "",
          approver: data.document?.approver || "",
        },
      }

      setCurrentCadeia(formattedCadeia)
    } catch (error) {
      console.error("Erro ao carregar detalhes da cadeia:", error)
      alert("Erro ao carregar detalhes da cadeia")
    } finally {
      setLoading(false)
    }
  }

  const addRow = () => {
    if (!currentCadeia) return

    const newRow: CadeiaRow = {
      id: `row-${Date.now()}`,
      nodes: [
        {
          id: `node-${Date.now()}-1`,
          text: "",
          isEmpty: true,
        },
      ],
    }

    setCurrentCadeia({
      ...currentCadeia,
      rows: [...currentCadeia.rows, newRow],
    })
  }

  const addNodeToRow = (rowId: string) => {
    if (!currentCadeia) return

    const updatedRows = currentCadeia.rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          nodes: [
            ...row.nodes,
            {
              id: `node-${Date.now()}-${row.nodes.length + 1}`,
              text: "",
              isEmpty: true,
            },
          ],
        }
      }
      return row
    })

    setCurrentCadeia({
      ...currentCadeia,
      rows: updatedRows,
    })
  }

  const updateNode = (nodeId: string, text: string, description?: string) => {
    if (!currentCadeia) return

    const updatedRows = currentCadeia.rows.map((row) => ({
      ...row,
      nodes: row.nodes.map((node) =>
        node.id === nodeId ? { ...node, text, description, isEmpty: !text.trim() } : node,
      ),
    }))

    setCurrentCadeia({
      ...currentCadeia,
      rows: updatedRows,
    })
  }

  const deleteNode = (nodeId: string) => {
    if (!currentCadeia) return

    const updatedRows = currentCadeia.rows.map((row) => ({
      ...row,
      nodes: row.nodes.filter((node) => node.id !== nodeId),
    }))

    setCurrentCadeia({
      ...currentCadeia,
      rows: updatedRows,
    })
  }

  const deleteRow = (rowId: string) => {
    if (!currentCadeia) return

    setCurrentCadeia({
      ...currentCadeia,
      rows: currentCadeia.rows.filter((row) => row.id !== rowId),
    })
  }

  const saveCadeia = async () => {
    if (!currentCadeia) return

    try {
      setLoading(true)
      // Por enquanto, vamos manter o localStorage até implementarmos a atualização completa no Supabase
      const updatedCadeias = currentCadeia.id
        ? cadeias.map((c) => (c.id === currentCadeia.id ? currentCadeia : c))
        : [...cadeias, { ...currentCadeia, id: `cadeia-${Date.now()}` }]

      setCadeias(updatedCadeias)
      localStorage.setItem("cadeias", JSON.stringify(updatedCadeias))
      alert("Cadeia salva com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar cadeia:", error)
      alert("Erro ao salvar cadeia")
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    if (!currentCadeia) return

    const dataStr = JSON.stringify(currentCadeia, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${currentCadeia.name}.json`
    link.click()
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
              <h1 className="text-xl font-semibold">{currentCadeia ? currentCadeia.title : "CADEIA DE VALOR"}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Select
                onValueChange={(value) => {
                  if (value === "new") {
                    setCurrentCadeia(null)
                  } else {
                    loadCadeiaDetails(value)
                  }
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione uma cadeia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nova Cadeia</SelectItem>
                  {cadeias.map((cadeia) => (
                    <SelectItem key={cadeia.id} value={cadeia.id!}>
                      {cadeia.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            <Dialog open={isNewCadeiaOpen} onOpenChange={setIsNewCadeiaOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Cadeia
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Cadeia de Valor</DialogTitle>
                </DialogHeader>
                <form action={createNewCadeia} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Cadeia</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="nodeCount">Número de Nós</Label>
                    <Input id="nodeCount" name="nodeCount" type="number" min="1" max="10" defaultValue="3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code">Código</Label>
                      <Input id="code" name="code" placeholder="CV-PA-01" />
                    </div>
                    <div>
                      <Label htmlFor="revision">Revisão</Label>
                      <Input id="revision" name="revision" placeholder="01" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <Label htmlFor="author">Elaborado por</Label>
                    <Input id="author" name="author" />
                  </div>
                  <div>
                    <Label htmlFor="approver">Aprovado por</Label>
                    <Input id="approver" name="approver" />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Criando..." : "Criar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button onClick={addRow} disabled={!currentCadeia || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Linha
            </Button>

            <Button onClick={() => selectedRow && addNodeToRow(selectedRow.id)} disabled={!selectedRow || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Nó
            </Button>

            <Button onClick={() => setIsInfoOpen(true)} disabled={!currentCadeia}>
              <Info className="h-4 w-4 mr-2" />
              Informações
            </Button>

            <Button onClick={saveCadeia} disabled={!currentCadeia || loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>

            <Button onClick={exportToExcel} disabled={!currentCadeia}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando...</p>
          </div>
        )}

        {!loading && currentCadeia ? (
          <div className="space-y-6">
            {currentCadeia.rows.map((row, rowIndex) => (
              <Card key={row.id} className={`${selectedRow?.id === row.id ? "ring-2 ring-green-500" : ""}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm">Linha {rowIndex + 1}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedRow(row)}>
                        Selecionar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addNodeToRow(row.id)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteRow(row.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 flex-wrap">
                    {row.nodes.map((node, nodeIndex) => (
                      <div key={node.id} className="flex items-center gap-2">
                        <div
                          className={`
                            w-28 h-20 border-2 rounded-lg flex items-center justify-center text-xs text-center p-2 cursor-pointer transition-all
                            ${node.isEmpty ? "border-dashed border-gray-300 bg-gray-50" : "border-solid border-gray-300 bg-white"}
                            ${selectedNode?.id === node.id ? "ring-2 ring-blue-500" : ""}
                            hover:shadow-md
                          `}
                          onClick={() => setSelectedNode(node)}
                        >
                          <div className="relative group w-full h-full flex items-center justify-center">
                            {node.text || "Clique para editar"}
                            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0 bg-transparent"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedNode(node)
                                  setIsEditNodeOpen(true)
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNode(node.id)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {nodeIndex < row.nodes.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma cadeia selecionada</p>
              <Button onClick={() => setIsNewCadeiaOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova Cadeia
              </Button>
            </div>
          )
        )}
      </main>

      {/* Edit Node Dialog */}
      <Dialog open={isEditNodeOpen} onOpenChange={setIsEditNodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Nó</DialogTitle>
          </DialogHeader>
          {selectedNode && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const text = formData.get("text") as string
                const description = formData.get("description") as string
                updateNode(selectedNode.id, text, description)
                setIsEditNodeOpen(false)
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="text">Nome do Nó</Label>
                <Input id="text" name="text" defaultValue={selectedNode.text} />
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea id="description" name="description" defaultValue={selectedNode.description || ""} />
              </div>
              <Button type="submit" className="w-full">
                Salvar
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Documento</DialogTitle>
          </DialogHeader>
          {currentCadeia && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Documento:</strong>
                  <p>PROC-ADM-001</p>
                </div>
                <div>
                  <strong>Código:</strong>
                  <p>{currentCadeia.documentInfo.code}</p>
                </div>
                <div>
                  <strong>Revisão:</strong>
                  <p>{currentCadeia.documentInfo.revision}</p>
                </div>
                <div>
                  <strong>Data:</strong>
                  <p>{currentCadeia.documentInfo.date}</p>
                </div>
                <div>
                  <strong>Elaborado por:</strong>
                  <p>{currentCadeia.documentInfo.author || "-"}</p>
                </div>
                <div>
                  <strong>Aprovado por:</strong>
                  <p>{currentCadeia.documentInfo.approver || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
