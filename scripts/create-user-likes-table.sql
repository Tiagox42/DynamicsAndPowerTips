-- Tabela para rastrear likes individuais
CREATE TABLE IF NOT EXISTS user_likes (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    user_id VARCHAR(200) NOT NULL, -- GitHub user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource_id, user_id) -- Previne likes duplicados
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_likes_resource ON user_likes(resource_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_user ON user_likes(user_id);
