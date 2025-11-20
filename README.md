# 🐾 Micro-serviço de Edição de Perfil - Pet-Joyful

Micro-serviço responsável pela edição e gerenciamento de perfis de usuários do Pet-Joyful, utilizando MongoDB para armazenamento.

## 📋 Funcionalidades

- ✅ Buscar perfil do usuário autenticado
- ✅ Atualizar perfil do usuário autenticado
- ✅ Buscar perfil por ID
- ✅ Atualizar perfil por ID (com verificação de propriedade)
- ✅ Validação de dados de entrada
- ✅ Autenticação via JWT
- ✅ CORS configurado
- ✅ Documentação Swagger interativa
- ✅ Armazenamento em MongoDB (coleção `profiles`)
- ✅ Upload de foto de perfil com Cloudinary

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do MongoDB
MONGODB_URI=mongodb://localhost:27017/petjoyful
# Ou para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/petjoyful

# Configurações do Servidor
PORT=3001
NODE_ENV=development

# JWT Secret
JWT_SECRET=sua_chave_secreta_jwt_aqui

# CORS
CORS_ORIGIN=http://localhost:3000

# Cloudinary (para upload de imagens)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

### 3. Executar o servidor

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em `http://localhost:3001`

## 📚 Documentação Swagger

A documentação interativa está disponível em:

```
http://localhost:3001/api-docs
```

### 🔑 Gerar Token Bearer para o Swagger

Para acessar os endpoints protegidos no Swagger, você precisa gerar um token JWT.

#### Opção 1: Usando o Script (Recomendado)

Execute o seguinte comando no terminal:

```bash
node generate-token.js
```

Copie o token que será exibido no terminal.

#### Opção 2: Usando o Terminal

Execute o seguinte comando no terminal:

```bash
node -e "const jwt = require('jsonwebtoken'); const secret = process.env.JWT_SECRET || 'default_secret_key_change_in_production'; const token = jwt.sign({userId: '507f1f77bcf86cd799439011', email: 'usuario@test.com', tipo: 'user'}, secret, {expiresIn: '24h'}); console.log('Bearer ' + token);"
```

### 🔐 Usar o Token no Swagger

1. Abra `http://localhost:3001/api-docs`
2. Clique no botão **"Authorize"** (ícone de cadeado)
3. Na janela que abrir, cole o token no formato:  
```  
Bearer SEU_TOKEN_AQUI  
```  
(Incluindo a palavra "Bearer ")
4. Clique em **"Authorize"** e depois em **"Close"**
5. Agora você consegue testar todos os endpoints protegidos ✅

**⏰ Validade:** O token expira em 24 horas. Se expirar, gere um novo!

## 📡 Endpoints

### Health Check
- **GET** `/health` - Verifica se o serviço está funcionando

### Perfil do Usuário Autenticado
- **GET** `/api/profile/me` - Buscar perfil do usuário autenticado
  - Headers: `Authorization: Bearer <token>`
  
- **PUT** `/api/profile/me` - Atualizar perfil do usuário autenticado
  - Headers: `Authorization: Bearer <token>`
  - Body: JSON com campos a serem atualizados
  
- **POST** `/api/profile/me/photo` - Upload de foto de perfil
  - Headers: `Authorization: Bearer <token>`
  - Body: `multipart/form-data` com campo `foto` (arquivo de imagem)

### Perfil por ID
- **GET** `/api/profile/:userId` - Buscar perfil por ID
  - Headers: `Authorization: Bearer <token>`
  
- **PUT** `/api/profile/:userId` - Atualizar perfil por ID
  - Headers: `Authorization: Bearer <token>`
  - Body: JSON com campos a serem atualizados
  - ⚠️ Apenas o próprio usuário pode editar seu perfil

## 📝 Exemplos de Requisição

### Atualizar Perfil

```bash
PUT http://localhost:3001/api/profile/me
Content-Type: application/json
Authorization: Bearer seu_token_jwt_aqui

{
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "data_nascimento": "1990-01-15",
  "bio": "Amo animais e sou voluntário em uma ONG",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "endereco": "Rua Exemplo",
  "numero": "123",
  "complemento": "Apto 45"
}
```

### Upload de Foto de Perfil

#### Usando cURL:
```bash
curl -X POST http://localhost:3001/api/profile/me/photo \
  -H "Authorization: Bearer seu_token_jwt_aqui" \
  -F "foto=@/caminho/para/sua/imagem.jpg"
```

#### Usando JavaScript/FormData:
```javascript
const formData = new FormData();
formData.append('foto', fileInput.files[0]);

fetch('http://localhost:3001/api/profile/me/photo', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu_token_jwt_aqui'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Resposta de Sucesso:
```json
{
  "success": true,
  "message": "Foto de perfil atualizada com sucesso",
  "data": {
    "foto_perfil": "https://res.cloudinary.com/seu-cloud/image/upload/v1234567890/pet-joyful/profiles/abc123.jpg"
  }
}
```

### Resposta de Sucesso

```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 99999-9999",
    "data_nascimento": "1990-01-15T00:00:00.000Z",
    "tipo_usuario": "tutor",
    "foto_perfil": null,
    "bio": "Amo animais e sou voluntário em uma ONG",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "endereco": "Rua Exemplo",
    "numero": "123",
    "complemento": "Apto 45",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🔒 Campos Validados

- **nome**: 2-255 caracteres
- **telefone**: Formato válido
- **data_nascimento**: Formato ISO8601 (YYYY-MM-DD), idade entre 13 e 120 anos
- **bio**: Máximo 1000 caracteres
- **cidade**: Máximo 100 caracteres
- **estado**: 2 caracteres (UF)
- **cep**: Formato 00000-000 ou 00000000
- **endereco**: Máximo 255 caracteres
- **numero**: Máximo 20 caracteres
- **complemento**: Máximo 100 caracteres
- **foto_perfil**: URL válida

## 🗄️ Estrutura do Banco de Dados

O micro-serviço utiliza MongoDB com a coleção `profiles`. O schema do documento é:

```javascript
{
  userId: ObjectId,        // Referência ao usuário (único)
  nome: String,
  email: String,
  telefone: String,
  data_nascimento: Date,
  tipo_usuario: String,    // 'tutor', 'instituicao', 'clinica'
  foto_perfil: String,     // URL da foto
  bio: String,
  cidade: String,
  estado: String,          // UF (2 caracteres)
  cep: String,
  endereco: String,
  numero: String,
  complemento: String,
  createdAt: Date,         // Criado automaticamente
  updatedAt: Date          // Atualizado automaticamente
}
```

## 🛠️ Tecnologias Utilizadas

- **Express.js** - Framework web
- **MongoDB + Mongoose** - Banco de dados NoSQL
- **JWT** - Autenticação
- **Express-Validator** - Validação de dados
- **Swagger** - Documentação da API
- **Multer** - Upload de arquivos
- **Cloudinary** - Armazenamento de imagens
- **CORS** - Controle de acesso
- **Dotenv** - Variáveis de ambiente

## 📁 Estrutura do Projeto

```
back perfil/
├── config/
│   └── database.js          # Configuração do MongoDB
├── controllers/
│   └── profileController.js # Lógica de negócio
├── middleware/
│   ├── auth.js              # Autenticação JWT
│   └── validation.js        # Validação de dados
├── models/
│   └── Profile.js           # Modelo Mongoose
├── routes/
│   └── profileRoutes.js     # Rotas da API
├── examples/
│   ├── api-examples.http    # Exemplos de requisições
│   └── frontend-integration.js # Exemplo de integração
├── .env                     # Variáveis de ambiente (não versionado)
├── .gitignore
├── generate-token.js         # Script para gerar token JWT
├── package.json
├── README.md
├── server.js                 # Arquivo principal
└── swagger.js                # Configuração Swagger
```

## 🔐 Segurança

- Autenticação via JWT obrigatória para todas as rotas
- Verificação de propriedade para edição de perfil
- Validação de dados de entrada
- Sanitização de inputs
- CORS configurado

## 📝 Notas

- O micro-serviço assume que a autenticação JWT já foi feita em outro serviço
- O token JWT deve conter `userId` ou `id` no payload
- Todos os campos são opcionais na atualização (apenas os fornecidos serão atualizados)
- O perfil é criado automaticamente na primeira atualização se não existir
- O `userId` no token deve corresponder ao `userId` do perfil no MongoDB

## 🔗 Integração com Frontend

Veja o arquivo `examples/frontend-integration.js` para exemplos de como integrar este micro-serviço com o frontend Next.js.

## 📄 Licença

ISC
#   E D I C A O - P E R F I L - M I C R O S E R V I C E 
 
 
