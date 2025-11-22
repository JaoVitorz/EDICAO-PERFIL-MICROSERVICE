# Correção de Erros no Upload de Imagem

## Problemas Identificados e Resolvidos

### 1. **Validação Insuficiente**

- ❌ **Antes**: O middleware aceitava qualquer arquivo que começasse com `image/`
- ✅ **Agora**: Lista específica de tipos MIME aceitos (JPEG, PNG, GIF, WebP)

### 2. **Mensagens de Erro Genéricas**

- ❌ **Antes**: "Erro ao fazer upload da imagem"
- ✅ **Agora**: Mensagens específicas para cada tipo de erro:
  - Arquivo não enviado
  - Arquivo inválido ou corrompido
  - Tipo de arquivo não permitido
  - Arquivo muito grande (>5MB)
  - Erros de configuração do Cloudinary
  - Erros de rede

### 3. **Falta de Validação do Buffer**

- ❌ **Antes**: Não verificava se o buffer do arquivo existia
- ✅ **Agora**: Valida se o buffer existe e não está vazio

### 4. **Erros do Multer Não Tratados**

- ❌ **Antes**: Erros do Multer não tinham tratamento específico
- ✅ **Agora**: Middleware dedicado `handleMulterError` para tratar:
  - `LIMIT_FILE_SIZE`: Arquivo muito grande
  - `LIMIT_UNEXPECTED_FILE`: Campo incorreto
  - Outros erros do Multer

### 5. **Falta de Logs**

- ❌ **Antes**: Logs mínimos
- ✅ **Agora**: Logs detalhados do processo de upload

## Melhorias Implementadas

### Middleware de Upload (`middleware/upload.js`)

```javascript
// ✅ Lista específica de tipos aceitos
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// ✅ Validações robustas
if (!req.file) {
  return res.status(400).json({
    message: "Nenhum arquivo foi enviado. Por favor, envie uma imagem.",
  });
}

if (!req.file.buffer || req.file.buffer.length === 0) {
  return res.status(400).json({
    message: "Arquivo inválido ou corrompido. Por favor, tente novamente.",
  });
}

// ✅ Logs informativos
console.log(
  `Fazendo upload da imagem: ${req.file.originalname} (${req.file.size} bytes)`
);
```

### Novo Middleware de Tratamento de Erros

```javascript
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Arquivo muito grande. O tamanho máximo permitido é 5MB.",
      });
    }
    // ... outros erros
  }
  next();
};
```

## Como Testar

### 1. **Teste Manual com Postman/Insomnia**

```http
POST http://localhost:3004/api/profile/me/photo
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: multipart/form-data

Campo: foto
Arquivo: sua_imagem.jpg
```

### 2. **Teste com cURL**

```bash
curl -X POST http://localhost:3004/api/profile/me/photo \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "foto=@/caminho/para/imagem.jpg"
```

### 3. **Teste com REST Client (VS Code)**

Use o arquivo `examples/test-upload-errors.http` criado

### 4. **Teste no Frontend**

```javascript
const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("foto", file);

  try {
    const response = await fetch("http://localhost:3004/api/profile/me/photo", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Agora você receberá mensagens específicas
      console.error(data.message);
      alert(data.message);
      return;
    }

    console.log("Upload bem-sucedido:", data);
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
};
```

## Casos de Erro e Suas Mensagens

| Cenário                  | Status | Mensagem                                                                             |
| ------------------------ | ------ | ------------------------------------------------------------------------------------ |
| Nenhum arquivo enviado   | 400    | "Nenhum arquivo foi enviado. Por favor, envie uma imagem."                           |
| Arquivo corrompido       | 400    | "Arquivo inválido ou corrompido. Por favor, tente novamente."                        |
| Tipo de arquivo inválido | 400    | "O arquivo enviado não é uma imagem válida. Formatos aceitos: JPEG, PNG, GIF, WebP." |
| Arquivo muito grande     | 400    | "Arquivo muito grande. O tamanho máximo permitido é 5MB."                            |
| Campo incorreto          | 400    | "Campo de arquivo inesperado. Use o campo 'foto' para enviar a imagem."              |
| Erro no Cloudinary       | 500    | "Erro de configuração do serviço de upload. Entre em contato com o suporte."         |
| Erro de rede             | 500    | "Erro de conexão ao fazer upload. Verifique sua internet e tente novamente."         |

## Verificação da Configuração do Cloudinary

Certifique-se de que as credenciais no `.env` estão corretas:

```env
CLOUDINARY_CLOUD_NAME=dc1d3tzms
CLOUDINARY_API_KEY=861985578347826
CLOUDINARY_API_SECRET=F-jBctEDV8bJqKQ4tg4oIgDoXCM
```

Teste a conexão:

```javascript
// Adicione isso temporariamente no server.js para testar
const { cloudinary } = require("./config/cloudinary");

cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("❌ Erro ao conectar com Cloudinary:", error);
  } else {
    console.log("✅ Cloudinary conectado com sucesso:", result);
  }
});
```

## Próximos Passos

1. ✅ Teste o upload com uma imagem válida
2. ✅ Teste os cenários de erro listados
3. ✅ Verifique os logs no console do servidor
4. ✅ Confirme que a URL da imagem está sendo salva no banco de dados
5. ✅ Teste no frontend para ver as mensagens de erro amigáveis

## Monitoramento

Agora você verá logs mais informativos no console:

```
Fazendo upload da imagem: perfil.jpg (245830 bytes)
Upload concluído com sucesso: https://res.cloudinary.com/.../image.jpg
Atualizando perfil do usuário 12345 com nova foto: https://...
```

## Suporte

Se o erro persistir, verifique:

1. **Credenciais do Cloudinary** estão corretas no `.env`
2. **Conexão com internet** está funcionando
3. **Formato da imagem** é realmente válido (tente abrir em um editor)
4. **Tamanho do arquivo** é menor que 5MB
5. **Campo do formulário** se chama "foto"
