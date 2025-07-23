import { type NextRequest, NextResponse } from "next/server"
import { createValueChain, getValueChains } from "@/lib/database"

export async function GET() {
  try {
    const valueChains = await getValueChains()
    return NextResponse.json(valueChains)
  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createValueChain(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
