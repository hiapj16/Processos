import { supabase } from "./supabase"

// Funções para Cadeias de Valor
export async function createValueChain(data: {
  name: string
  title: string
  documentInfo: {
    code: string
    revision: string
    date: string
    author: string
    approver: string
  }
}) {
  try {
    // Primeiro, criar o documento
    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert([
        {
          code: data.documentInfo.code,
          revision: data.documentInfo.revision,
          date: data.documentInfo.date,
          author: data.documentInfo.author,
          approver: data.documentInfo.approver,
        },
      ])
      .select()
      .single()

    if (docError) throw docError

    // Depois, criar a cadeia de valor
    const { data: valueChain, error: chainError } = await supabase
      .from("value_chains")
      .insert([
        {
          name: data.name,
          title: data.title,
          document_id: document.id,
        },
      ])
      .select()
      .single()

    if (chainError) throw chainError

    return { valueChain, document }
  } catch (error) {
    console.error("Erro ao criar cadeia de valor:", error)
    throw error
  }
}

export async function getValueChains() {
  try {
    const { data, error } = await supabase
      .from("value_chains")
      .select(`
        *,
        document:documents(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao buscar cadeias de valor:", error)
    throw error
  }
}

export async function getValueChainWithDetails(id: string) {
  try {
    const { data: valueChain, error: chainError } = await supabase
      .from("value_chains")
      .select(`
        *,
        document:documents(*)
      `)
      .eq("id", id)
      .single()

    if (chainError) throw chainError

    const { data: rows, error: rowsError } = await supabase
      .from("value_chain_rows")
      .select(`
        *,
        nodes:value_chain_nodes(*)
      `)
      .eq("value_chain_id", id)
      .order("position")

    if (rowsError) throw rowsError

    return { ...valueChain, rows }
  } catch (error) {
    console.error("Erro ao buscar detalhes da cadeia de valor:", error)
    throw error
  }
}

export async function createValueChainRow(valueChainId: string, position: number) {
  try {
    const { data, error } = await supabase
      .from("value_chain_rows")
      .insert([
        {
          value_chain_id: valueChainId,
          position,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao criar linha da cadeia:", error)
    throw error
  }
}

export async function createValueChainNode(rowId: string, position: number, text?: string) {
  try {
    const { data, error } = await supabase
      .from("value_chain_nodes")
      .insert([
        {
          row_id: rowId,
          position,
          text: text || "",
          is_empty: !text,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao criar nó da cadeia:", error)
    throw error
  }
}

export async function updateValueChainNode(id: string, text: string, description?: string) {
  try {
    const { data, error } = await supabase
      .from("value_chain_nodes")
      .update({
        text,
        description,
        is_empty: !text.trim(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao atualizar nó da cadeia:", error)
    throw error
  }
}

export async function deleteValueChainNode(id: string) {
  try {
    const { error } = await supabase.from("value_chain_nodes").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Erro ao deletar nó da cadeia:", error)
    throw error
  }
}

export async function deleteValueChainRow(id: string) {
  try {
    const { error } = await supabase.from("value_chain_rows").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Erro ao deletar linha da cadeia:", error)
    throw error
  }
}

// Funções similares podem ser criadas para Estruturas e Fluxogramas
