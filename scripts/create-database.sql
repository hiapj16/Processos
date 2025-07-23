-- Criar tabelas para o sistema de gerenciamento de processos

-- Tabela para armazenar informações dos documentos
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    revision VARCHAR(10) NOT NULL DEFAULT '01',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    author VARCHAR(255),
    approver VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para cadeias de valor
CREATE TABLE IF NOT EXISTS value_chains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para linhas da cadeia de valor
CREATE TABLE IF NOT EXISTS value_chain_rows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    value_chain_id UUID REFERENCES value_chains(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para nós da cadeia de valor
CREATE TABLE IF NOT EXISTS value_chain_nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    row_id UUID REFERENCES value_chain_rows(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    text TEXT,
    description TEXT,
    is_empty BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para estruturas organizacionais
CREATE TABLE IF NOT EXISTS organizational_structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para nós da estrutura organizacional
CREATE TABLE IF NOT EXISTS structure_nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    structure_id UUID REFERENCES organizational_structures(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES structure_nodes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position_x DECIMAL(10,2),
    position_y DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para fluxogramas
CREATE TABLE IF NOT EXISTS flowcharts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    diagram_data JSONB, -- Para armazenar dados do GoJS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para elementos do fluxograma
CREATE TABLE IF NOT EXISTS flowchart_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    flowchart_id UUID REFERENCES flowcharts(id) ON DELETE CASCADE,
    element_key VARCHAR(255) NOT NULL,
    element_type VARCHAR(50) NOT NULL, -- start, end, activity, decision, relatedFlow
    text TEXT,
    position_x DECIMAL(10,2),
    position_y DECIMAL(10,2),
    is_related_flow BOOLEAN DEFAULT false,
    related_flow_target VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para requisitos dos elementos
CREATE TABLE IF NOT EXISTS element_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    element_id UUID REFERENCES flowchart_elements(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para normas dos elementos
CREATE TABLE IF NOT EXISTS element_norms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    element_id UUID REFERENCES flowchart_elements(id) ON DELETE CASCADE,
    norm TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para conexões do fluxograma
CREATE TABLE IF NOT EXISTS flowchart_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    flowchart_id UUID REFERENCES flowcharts(id) ON DELETE CASCADE,
    from_element_key VARCHAR(255) NOT NULL,
    to_element_key VARCHAR(255) NOT NULL,
    from_port VARCHAR(50),
    to_port VARCHAR(50),
    connection_type VARCHAR(50) DEFAULT 'normal', -- normal, relatedLink
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_value_chains_document_id ON value_chains(document_id);
CREATE INDEX IF NOT EXISTS idx_value_chain_rows_chain_id ON value_chain_rows(value_chain_id);
CREATE INDEX IF NOT EXISTS idx_value_chain_nodes_row_id ON value_chain_nodes(row_id);
CREATE INDEX IF NOT EXISTS idx_structure_nodes_structure_id ON structure_nodes(structure_id);
CREATE INDEX IF NOT EXISTS idx_structure_nodes_parent_id ON structure_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_flowchart_elements_flowchart_id ON flowchart_elements(flowchart_id);
CREATE INDEX IF NOT EXISTS idx_element_requirements_element_id ON element_requirements(element_id);
CREATE INDEX IF NOT EXISTS idx_element_norms_element_id ON element_norms(element_id);
CREATE INDEX IF NOT EXISTS idx_flowchart_connections_flowchart_id ON flowchart_connections(flowchart_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_value_chains_updated_at BEFORE UPDATE ON value_chains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_value_chain_nodes_updated_at BEFORE UPDATE ON value_chain_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizational_structures_updated_at BEFORE UPDATE ON organizational_structures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_structure_nodes_updated_at BEFORE UPDATE ON structure_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flowcharts_updated_at BEFORE UPDATE ON flowcharts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flowchart_elements_updated_at BEFORE UPDATE ON flowchart_elements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
