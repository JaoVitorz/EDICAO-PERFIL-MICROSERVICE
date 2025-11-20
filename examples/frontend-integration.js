/**
 * Exemplo de integração do frontend com o micro-serviço de perfil
 *
 * Este arquivo mostra como integrar o micro-serviço de perfil
 * com o frontend Next.js do Pet-Joyful
 */

// Exemplo usando Axios (já está no projeto)
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://localhost:3004";

// Criar instância do axios com configurações padrão
const profileApi = axios.create({
  baseURL: `${API_BASE_URL}/api/profile`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT automaticamente
profileApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou de onde você armazena o token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Buscar perfil do usuário autenticado
 */
export const getMyProfile = async () => {
  try {
    const response = await profileApi.get("/me");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }
};

/**
 * Atualizar perfil do usuário autenticado
 */
export const updateMyProfile = async (profileData) => {
  try {
    const response = await profileApi.put("/me", profileData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

/**
 * Buscar perfil por ID
 */
export const getProfileById = async (userId) => {
  try {
    const response = await profileApi.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }
};

/**
 * Atualizar perfil por ID
 */
export const updateProfileById = async (userId, profileData) => {
  try {
    const response = await profileApi.put(`/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

// Exemplo de uso em um componente React/Next.js
/*
import { getMyProfile, updateMyProfile } from '@/services/profileApi';

// Em um componente
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const response = await updateMyProfile(formData);
      setProfile(response.data);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil');
    }
  };

  if (loading) return null; // Renderizar componente de loading
  if (!profile) return null; // Renderizar componente de erro

  // Renderizar o perfil e formulário de edição
  return null; // Implementar JSX aqui conforme necessário
};
*/
