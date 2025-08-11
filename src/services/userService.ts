/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/userService.ts

export interface UserData {
  name: string;
  email: string;
  cpf: string;
  password: string;
  password_confirmation: string;
  phone: string;
  birthday: string;
  user_type: string;
}

export interface ApiRequerimento {
  protocol: number;
  status: string;
  observations: string;
  enrollment: string;
}

interface LoginData {
  cpf: string;
  password: string;
}

export async function listarUsuarios() {
  const response = await fetch("http://127.0.0.1:8000/api/alunos");
  return await response.json();
}

export async function cadastrarUsuario(data: UserData) {
  const response = await fetch("http://127.0.0.1:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json", 
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Ocorreu um erro na solicitação.";
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function logarUsuario(data: LoginData) {
  const response = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  // Se a resposta da API indicar um erro (status não-2xx)
  if (!response.ok) {
    // Lança um erro com a mensagem vinda da API (ex: "Invalid credentials")
    throw new Error(responseData.message || "CPF ou senha inválidos.");
  }

  // Se tudo deu certo, retorna os dados (que devem incluir o token)
  return responseData;
}

export async function getMinhasMatriculas(): Promise<any[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    // Se não houver token, não há como buscar os dados
    throw new Error('Token de autenticação não encontrado.');
  }

  const response = await fetch('http://127.0.0.1:8000/api/my-registrations', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao buscar suas matrículas.');
  }

  return response.json();
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    return response.ok;

  } catch (error) {
    console.error("Falha na requisição para /api/v1/validate-token:", error);
    return false;
  }
}

export async function getTiposRequerimento(): Promise<any[]> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticação não encontrado.');

  const response = await fetch('http://127.0.0.1:8000/api/tipos-requerimento', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Falha ao buscar os tipos de requerimento.');
  return response.json();
}

export async function cadastrarRequerimento(formData: FormData) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token de autenticação não encontrado.');

  const response = await fetch("http://127.0.0.1:8000/api/requerimentos", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // Envia como FormData para suportar arquivos
  });

  if (!response.ok) {
    const errorData = await response.json();
    const firstError = errorData.errors ? Object.values(errorData.errors)[0][0] : null;
    throw new Error(firstError || errorData.message || "Ocorreu um erro na solicitação.");
  }

  return response.json();
}

export async function listarTodosRequerimentos(): Promise<any> {


  const response = await fetch('http://127.0.0.1:8000/api/requerimentos', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Não autorizado. Verifique se o token de admin é válido.');
    }
    throw new Error('Falha ao buscar a lista de requerimentos.');
  }

  return response.json();
}

export async function getRequerimentoById(id: number | string): Promise<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticação não encontrado.');
  }

  // Constrói a URL da API dinamicamente com o ID fornecido
  const apiUrl = `http://127.0.0.1:8000/api/requerimentos/${id}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  // Verifica se a resposta da API foi bem-sucedida
  if (!response.ok) {
    // Tenta extrair uma mensagem de erro do corpo da resposta
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Falha ao buscar o requerimento com ID ${id}.`;
    
    // Lança um erro com a mensagem apropriada
    throw new Error(errorMessage);
  }

  // Retorna os dados do requerimento em formato JSON
  return response.json();
}


