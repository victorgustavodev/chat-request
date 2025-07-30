/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/userService.ts

export interface UserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  cpf: string;
  birthday: string;
  phone: string;
  user_type: string;
}

export async function listarUsuarios() {
  const response = await fetch("http://127.0.0.1:8000/api/users");
  return await response.json();
}

export async function cadastrarUsuario(data: UserData) {
  await fetch("http://127.0.0.1:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function logarUsuario(data: UserData) {
  const response = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

//Validar Token

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.valid; // O backend deve retornar { valid: true } se o token for válido
  } catch (error) {
    return false;
  }
}