-- Criar tabela para armazenar recursos
CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    title_en VARCHAR(500),
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    description_en TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(200) NOT NULL,
    submitted_by VARCHAR(200) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_subcategory ON resources(subcategory);
CREATE INDEX IF NOT EXISTS idx_resources_submitted_at ON resources(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_likes_count ON resources(likes_count DESC);

-- Inserir alguns dados de exemplo
INSERT INTO resources (title, title_en, url, description, description_en, category, subcategory, submitted_by) VALUES
(
    'How to Debug Dynamics 365 Plugins | Plugin Profiler & Plugin Trace Viewer Tutorial',
    'How to Debug Dynamics 365 Plugins | Plugin Profiler & Plugin Trace Viewer Tutorial',
    'https://www.youtube.com/watch?v=example1',
    'Tutorial completo sobre como debugar plugins do Dynamics 365 usando Plugin Profiler e Plugin Trace Viewer.',
    'Complete tutorial on how to debug Dynamics 365 plugins using Plugin Profiler and Plugin Trace Viewer.',
    'desenvolvimento',
    'Ferramentas para Debug e Logging',
    'João Silva'
),
(
    'Power BI Integration with Dynamics 365',
    'Power BI Integration with Dynamics 365',
    'https://docs.microsoft.com/power-bi-dynamics',
    'Guia oficial da Microsoft sobre como integrar Power BI com Dynamics 365 CRM.',
    'Official Microsoft guide on how to integrate Power BI with Dynamics 365 CRM.',
    'consultas',
    'Power BI e Dashboards no Dynamics',
    'Maria Santos'
),
(
    'XrmToolBox - Essential Tools for Dynamics 365',
    'XrmToolBox - Essential Tools for Dynamics 365',
    'https://www.xrmtoolbox.com/',
    'Coleção de ferramentas essenciais para administradores e desenvolvedores Dynamics 365.',
    'Collection of essential tools for Dynamics 365 administrators and developers.',
    'ferramentas',
    'XrmToolBox e Plugins Úteis',
    'Pedro Costa'
);

-- Verificar se os dados foram inseridos
SELECT COUNT(*) as total_resources FROM resources;
