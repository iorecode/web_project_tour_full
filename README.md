# 🌍 Placeholder Turismo

O **Placeholder Turismo** é uma plataforma desenvolvida com **React.js** no frontend e **Node.js** no backend, utilizando **MongoDB** como banco de dados. O sistema permite criar, editar e remover ofertas de pacotes turísticos, além de adicionar, visualizar e excluir avaliações de locais. Conta com um painel administrativo para gerenciar as funcionalidades de forma segura e eficiente.

O site pode ser acessado [http://wtr.heidel.ro](https://wtr.heidel.ro) e a api em [http://api.wtr.heidel.ro](https://api.wtr.heidel.ro).

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js com React Router para navegação.
- **Backend**: Node.js com Express.js para a API, MongoDB com Mongoose para o banco de dados e JWT para autenticação.
- **Validação**: Celebrate/Joi para validação de dados recebidos pela API.

## 🚀 Como Rodar o Projeto

1. **Backend**: Configure o MongoDB, instale as dependências (`npm install`), adicione as variáveis de ambiente no arquivo `.env` (como `MONGO_URI` e `JWT_SECRET`) e inicie o servidor com `npm start`.
2. **Frontend**: Instale as dependências, configure o arquivo `.env` com `REACT_APP_API_URL` apontando para o backend e inicie o servidor com `npm start`.

O frontend estará disponível em [http://localhost:5173](http://localhost:3000) e o backend em [http://localhost:3000](http://localhost:5000).

## 📂 Funcionalidades

- Gerenciamento de ofertas e avaliações.
- Painel administrativo restrito.
- Segurança com autenticação JWT e armazenamento seguro de senhas com bcrypt.

Contribuições são bem-vindas para aprimorar a plataforma! 🚀