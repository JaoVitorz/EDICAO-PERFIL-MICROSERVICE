-- Exemplo de estrutura da tabela usuarios para o micro-serviço de perfil
-- Este é um exemplo baseado nas necessidades do micro-serviço
-- Ajuste conforme sua estrutura de banco de dados existente

-- Verificar se a tabela já existe e criar se necessário
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usuarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE usuarios (
        id INT PRIMARY KEY IDENTITY(1,1),
        nome NVARCHAR(255),
        email NVARCHAR(255) UNIQUE NOT NULL,
        senha NVARCHAR(255), -- Hash da senha
        telefone NVARCHAR(20),
        data_nascimento DATE,
        tipo_usuario NVARCHAR(50), -- 'tutor', 'instituicao', 'clinica'
        foto_perfil NVARCHAR(500), -- URL da foto
        bio NVARCHAR(1000),
        cidade NVARCHAR(100),
        estado NVARCHAR(2), -- UF
        cep NVARCHAR(10),
        endereco NVARCHAR(255),
        numero NVARCHAR(20),
        complemento NVARCHAR(100),
        data_criacao DATETIME DEFAULT GETDATE(),
        data_atualizacao DATETIME,
        
        -- Índices para melhor performance
        INDEX IX_usuarios_email (email),
        INDEX IX_usuarios_tipo_usuario (tipo_usuario)
    );
    
    PRINT 'Tabela usuarios criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela usuarios já existe.';
END

-- Exemplo de dados de teste (opcional)
-- INSERT INTO usuarios (nome, email, telefone, tipo_usuario, bio, cidade, estado)
-- VALUES 
--     ('João Silva', 'joao@example.com', '(11) 99999-9999', 'tutor', 'Amo animais', 'São Paulo', 'SP'),
--     ('Maria Santos', 'maria@example.com', '(11) 88888-8888', 'instituicao', 'ONG de adoção', 'São Paulo', 'SP');

-- Verificar estrutura da tabela
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'usuarios'
ORDER BY ORDINAL_POSITION;

