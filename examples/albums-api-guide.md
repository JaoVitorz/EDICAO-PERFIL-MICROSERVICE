# API de Álbuns de Fotos - Pet Joyful

## Endpoints Disponíveis

### 1. Criar Álbum

```http
POST https://edicao-perfil-microservice.onrender.com/api/albums
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Minhas Fotos com Rex",
  "descricao": "Melhores momentos com meu cachorro",
  "privacidade": "publico"
}
```

### 2. Listar Meus Álbuns

```http
GET https://edicao-perfil-microservice.onrender.com/api/albums
Authorization: Bearer {token}
```

### 3. Buscar Álbum Específico

```http
GET https://edicao-perfil-microservice.onrender.com/api/albums/{albumId}
Authorization: Bearer {token}
```

### 4. Atualizar Álbum

```http
PUT https://edicao-perfil-microservice.onrender.com/api/albums/{albumId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Novo título",
  "descricao": "Nova descrição",
  "privacidade": "privado"
}
```

### 5. Adicionar Foto ao Álbum

```http
POST https://edicao-perfil-microservice.onrender.com/api/albums/{albumId}/photos
Authorization: Bearer {token}
Content-Type: multipart/form-data

foto: [arquivo de imagem]
legenda: "Dia no parque"
```

### 6. Remover Foto do Álbum

```http
DELETE https://edicao-perfil-microservice.onrender.com/api/albums/{albumId}/photos/{fotoId}
Authorization: Bearer {token}
```

### 7. Deletar Álbum

```http
DELETE https://edicao-perfil-microservice.onrender.com/api/albums/{albumId}
Authorization: Bearer {token}
```

---

## Exemplo de Resposta - Álbum

```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f3a",
    "userId": "60d5ec49f1b2c72b8c8e4f3b",
    "titulo": "Minhas Fotos com Rex",
    "descricao": "Melhores momentos com meu cachorro",
    "fotos": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f3c",
        "url": "https://res.cloudinary.com/.../foto1.jpg",
        "public_id": "pet-joyful/albums/abc123",
        "legenda": "Dia no parque",
        "ordem": 0,
        "data_upload": "2025-11-24T10:30:00.000Z"
      }
    ],
    "capa": "https://res.cloudinary.com/.../foto1.jpg",
    "privacidade": "publico",
    "total_fotos": 1,
    "createdAt": "2025-11-24T10:00:00.000Z",
    "updatedAt": "2025-11-24T10:30:00.000Z"
  }
}
```

---

## Integração com Frontend (React/Next.js)

### Serviço de API - albumApi.ts

```typescript
import axios from "axios";

const API_URL = "https://edicao-perfil-microservice.onrender.com/api";

const getToken = () => localStorage.getItem("token");

// Criar álbum
export const createAlbum = async (data: {
  titulo: string;
  descricao?: string;
  privacidade?: "publico" | "privado" | "amigos";
}) => {
  const response = await axios.post(`${API_URL}/albums`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Listar álbuns
export const getMyAlbums = async () => {
  const response = await axios.get(`${API_URL}/albums`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Buscar álbum
export const getAlbum = async (albumId: string) => {
  const response = await axios.get(`${API_URL}/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Atualizar álbum
export const updateAlbum = async (albumId: string, data: any) => {
  const response = await axios.put(`${API_URL}/albums/${albumId}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Adicionar foto
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
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Remover foto
export const removePhotoFromAlbum = async (albumId: string, fotoId: string) => {
  const response = await axios.delete(
    `${API_URL}/albums/${albumId}/photos/${fotoId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

// Deletar álbum
export const deleteAlbum = async (albumId: string) => {
  const response = await axios.delete(`${API_URL}/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};
```

### Componente de Exemplo - AlbumGallery.tsx

```tsx
"use client";
import { useState, useEffect } from "react";
import { getMyAlbums, createAlbum, addPhotoToAlbum } from "@/services/albumApi";

export default function AlbumGallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const response = await getMyAlbums();
      setAlbums(response.data);
    } catch (error) {
      console.error("Erro ao carregar álbuns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async () => {
    try {
      await createAlbum({
        titulo: "Novo Álbum",
        descricao: "Descrição do álbum",
        privacidade: "publico",
      });
      loadAlbums();
    } catch (error) {
      console.error("Erro ao criar álbum:", error);
    }
  };

  const handleAddPhoto = async (albumId: string, file: File) => {
    try {
      await addPhotoToAlbum(albumId, file, "Nova foto");
      loadAlbums();
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="album-gallery">
      <button onClick={handleCreateAlbum}>+ Novo Álbum</button>

      <div className="albums-grid">
        {albums.map((album: any) => (
          <div key={album._id} className="album-card">
            <img src={album.capa || "/default-album.png"} alt={album.titulo} />
            <h3>{album.titulo}</h3>
            <p>{album.total_fotos} fotos</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleAddPhoto(album._id, e.target.files[0]);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Estrutura do Banco de Dados

### Collection: albums

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  titulo: String,
  descricao: String,
  fotos: [
    {
      _id: ObjectId,
      url: String,
      public_id: String,
      legenda: String,
      ordem: Number,
      data_upload: Date
    }
  ],
  capa: String,
  privacidade: String (enum: ['publico', 'privado', 'amigos']),
  total_fotos: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Funcionalidades

✅ Criar álbuns com título, descrição e privacidade
✅ Upload múltiplo de fotos em cada álbum
✅ Legendas para cada foto
✅ Capa do álbum (primeira foto automaticamente)
✅ Ordenação automática de fotos
✅ Contagem de fotos por álbum
✅ Controle de privacidade (público, privado, amigos)
✅ Deletar fotos individuais
✅ Deletar álbum completo (com todas as fotos do Cloudinary)
✅ Integração completa com Cloudinary
✅ Autenticação JWT
✅ Documentação Swagger

---

## Próximos Passos no Frontend

1. Criar componente de galeria de álbuns
2. Criar componente de visualização de álbum individual
3. Implementar modal de upload de fotos
4. Adicionar lightbox para visualização de fotos
5. Implementar drag & drop para reordenar fotos
6. Adicionar filtros e pesquisa de álbuns
