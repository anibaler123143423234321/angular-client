export interface User{
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  token: string;
  sede: string;
  role?: string;
  estado?: string;
  dni?: string;
  imageUrl?: string;
  password?: string;
}

/**
 * Estructura que retorna tu backend en el endpoint /listar
 * cuando usas paginación en Spring Boot.
 */
export interface UserPageResponse {
  users: User[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
