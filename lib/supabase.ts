import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Document {
  id: string
  code: string
  revision: string
  date: string
  author?: string
  approver?: string
  created_at: string
  updated_at: string
}

export interface ValueChain {
  id: string
  name: string
  title: string
  document_id: string
  created_at: string
  updated_at: string
  document?: Document
}

export interface ValueChainRow {
  id: string
  value_chain_id: string
  position: number
  created_at: string
}

export interface ValueChainNode {
  id: string
  row_id: string
  position: number
  text?: string
  description?: string
  is_empty: boolean
  created_at: string
  updated_at: string
}

export interface OrganizationalStructure {
  id: string
  name: string
  document_id: string
  created_at: string
  updated_at: string
  document?: Document
}

export interface StructureNode {
  id: string
  structure_id: string
  parent_id?: string
  name: string
  position_x?: number
  position_y?: number
  created_at: string
  updated_at: string
}

export interface Flowchart {
  id: string
  name: string
  document_id: string
  diagram_data?: any
  created_at: string
  updated_at: string
  document?: Document
}

export interface FlowchartElement {
  id: string
  flowchart_id: string
  element_key: string
  element_type: string
  text?: string
  position_x?: number
  position_y?: number
  is_related_flow: boolean
  related_flow_target?: string
  created_at: string
  updated_at: string
}
