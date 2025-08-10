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

interface LoginData {
  cpf: string;
  password: string;
}

export async function listarUsuarios() {
  const response = await fetch("http://127.0.0.1:8000/api/users");
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

//Validar Token


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
    console.error("Falha na requisição para /api/validate-token:", error);
    return false;
  }
}