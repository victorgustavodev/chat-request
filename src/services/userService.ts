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
  await fetch("http://127.0.0.1:8000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}