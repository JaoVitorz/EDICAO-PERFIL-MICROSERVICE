# 📋 GUIA DE INSTALAÇÃO - Sistema de Álbuns no Frontend

## ⚠️ IMPORTANTE: Siga os passos NA ORDEM

---

## 📁 PASSO 1: Criar a estrutura de pastas

No seu projeto frontend, crie as seguintes pastas:

```
src/
├── app/
│   ├── albums/                         👈 CRIAR ESTA PASTA
│   │   └── [albumId]/                  👈 CRIAR ESTA PASTA
│   └── components/
│       └── albums/                     👈 CRIAR ESTA PASTA
├── services/
└── types/
```

### Comandos PowerShell (rode na raiz do projeto frontend):

```powershell
# Criar estrutura de pastas
New-Item -ItemType Directory -Force -Path "src/app/albums/[albumId]"
New-Item -ItemType Directory -Force -Path "src/app/components/albums"
```

---

## 📄 PASSO 2: Criar os arquivos TypeScript

### 2.1. Criar `src/types/album.types.ts`

```typescript
export interface Foto {
  _id: string;
  url: string;
  public_id: string;
  legenda?: string;
  ordem: number;
  data_upload: string;
}

export interface Album {
  _id: string;
  userId: string;
  titulo: string;
  descricao?: string;
  fotos: Foto[];
  capa?: string;
  privacidade: "publico" | "privado" | "amigos";
  total_fotos: number;
  createdAt: string;
  updatedAt: string;
}
```

### 2.2. Criar `src/services/albumApi.ts`

```typescript
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL ||
  "https://edicao-perfil-microservice.onrender.com/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const createAlbum = async (data: {
  titulo: string;
  descricao?: string;
  privacidade?: "publico" | "privado" | "amigos";
}) => {
  const response = await axios.post(`${API_URL}/albums`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getMyAlbums = async () => {
  const response = await axios.get(`${API_URL}/albums`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAlbum = async (albumId: string) => {
  const response = await axios.get(`${API_URL}/albums/${albumId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateAlbum = async (
  albumId: string,
  data: {
    titulo?: string;
    descricao?: string;
    privacidade?: "publico" | "privado" | "amigos";
    capa?: string;
  }
) => {
  const response = await axios.put(`${API_URL}/albums/${albumId}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const addPhotoToAlbum = async (
  albumId: string,
  file: File,
  legenda?: string
) => {
  const formData = new FormData();
  formData.append("foto", file);
  if (legenda) formData.append("legenda", legenda);

  const response = await axios.post(
    `${API_URL}/albums/${albumId}/photos`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const removePhotoFromAlbum = async (albumId: string, fotoId: string) => {
  const response = await axios.delete(
    `${API_URL}/albums/${albumId}/photos/${fotoId}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

export const deleteAlbum = async (albumId: string) => {
  const response = await axios.delete(`${API_URL}/albums/${albumId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
```

### 2.3. Criar `src/app/components/albums/AlbumsList.tsx`

**COPIE TODO O CÓDIGO DO COMPONENTE AlbumsList do arquivo `frontend-albums-integration.tsx`**
(linhas 198-448)

### 2.4. Criar `src/app/components/albums/AlbumView.tsx`

**COPIE TODO O CÓDIGO DO COMPONENTE AlbumView do arquivo `frontend-albums-integration.tsx`**
(linhas 454-640)

### 2.5. Criar `src/app/albums/page.tsx`

```typescript
import AlbumsList from "@/app/components/albums/AlbumsList";

export default function AlbumsPage() {
  return <AlbumsList />;
}
```

### 2.6. Criar `src/app/albums/[albumId]/page.tsx`

```typescript
import AlbumView from "@/app/components/albums/AlbumView";

export default function AlbumDetailPage({
  params,
}: {
  params: { albumId: string };
}) {
  return <AlbumView albumId={params.albumId} />;
}
```

---

## 🔧 PASSO 3: Configurar variáveis de ambiente

Adicione no arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_PROFILE_API_URL=https://edicao-perfil-microservice.onrender.com/api
```

---

## 🎨 PASSO 4: Instalar dependências necessárias

```bash
npm install lucide-react
# ou
yarn add lucide-react
```

---

## 🔗 PASSO 5: Adicionar link para acessar os álbuns

No seu componente de perfil (ex: `ProfileHeader.tsx` ou onde você tiver tabs/navegação), adicione:

### Opção 1: Botão simples

```tsx
import Link from "next/link";

<Link
  href="/albums"
  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
>
  <ImageIcon size={20} />
  Meus Álbuns
</Link>;
```

### Opção 2: Tab na navegação

```tsx
const profileTabs = [
  { label: "Publicações", href: "/profile" },
  { label: "Sobre", href: "/profile/about" },
  { label: "Álbuns", href: "/albums" }, // 👈 ADICIONE ESTA LINHA
];
```

---

## ✅ PASSO 6: Testar

1. Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Acesse: `http://localhost:3000/albums`

3. Você deverá ver a página de álbuns

4. Teste criar um álbum

5. Teste adicionar fotos

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module '@/app/components/albums/AlbumsList'"

- Verifique se criou a pasta `src/app/components/albums`
- Verifique se criou o arquivo `AlbumsList.tsx`
- Verifique se o `tsconfig.json` tem o alias `@` configurado

### Erro: "404 - Page not found" ao acessar /albums

- Verifique se criou a pasta `src/app/albums`
- Verifique se criou o arquivo `page.tsx` dentro de `albums/`
- Reinicie o servidor Next.js

### Erro: "401 Unauthorized"

- Verifique se o token está salvo no localStorage
- Verifique se a variável `NEXT_PUBLIC_PROFILE_API_URL` está configurada
- Verifique se está logado no sistema

### Erro ao fazer upload de fotos

- Verifique se o backend está rodando
- Verifique as credenciais do Cloudinary no backend
- Verifique o console do navegador para erros detalhados

---

## 📱 COMO USAR

1. **Criar Álbum**: Clique em "Novo Álbum" e preencha o formulário
2. **Adicionar Fotos**: Clique no álbum, depois em "Adicionar Fotos"
3. **Visualizar Foto**: Clique na foto para abrir em tela cheia
4. **Deletar Foto**: Passe o mouse sobre a foto e clique no ícone de lixeira
5. **Deletar Álbum**: Na lista de álbuns, clique no ícone de lixeira

---

## 🎯 PRÓXIMOS PASSOS (OPCIONAL)

- [ ] Adicionar drag & drop para upload de múltiplas fotos
- [ ] Adicionar opção de editar legenda da foto
- [ ] Adicionar filtro por privacidade
- [ ] Adicionar pesquisa de álbuns
- [ ] Adicionar compartilhamento de álbuns
- [ ] Adicionar ordenação de fotos dentro do álbum
