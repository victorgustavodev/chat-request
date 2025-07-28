// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { listarUsuarios } from "@/services/userService";

// export default async function ListUsers() {
//   const usuarios = await listarUsuarios();
//   return(

//     <main className="flex flex-col gap-2">
//         <h1 className="text-2xl font-bold">Lista de Usuários</h1>
//         <div className="flex flex-col gap-2">
//             <ul>
//                 <li>Nome</li>
//                 <li>Email</li>
//                 <li>CPF</li>
//                 <li>Data de Nascimento</li>
//                 <li>Telefone</li>
//             </ul>
//         </div>
//   <div>{usuarios.map((usuario: any) => (
//     <div className="flex flex-col gap-2 bg-red-600" key={usuario.id}>
//         <ul key={usuario.id}>
//             <li>{usuario.name}</li>
//             <li>{usuario.email}</li>
//             <li>{usuario.cpf}</li>
//             <li>{usuario.birthday}</li>
//             <li>{usuario.phone}</li>
//             <li>{usuario.user_type}</li>
//         </ul>
//     </div>
//   ))}</div>
//   </main>
// )
// }