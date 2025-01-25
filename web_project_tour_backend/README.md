### README - Backend para Site de Turismo

---

#### **Descrição do Projeto**

Este é o backend de um site para uma companhia de turismo, desenvolvido em **Node.js** com o framework **Express**. Ele segue as práticas RESTful, utiliza **MongoDB** como banco de dados, e é protegido por diversas camadas de segurança para garantir a integridade dos dados e das conexões.

---

#### **Funcionalidades**

- **Gerenciamento de Ofertas:** Endpoints para listar e adicionar ofertas de viagens.
- **Gerenciamento de Avaliações:** Endpoints para listar, adicionar e recuperar as melhores avaliações.
- **Autenticação e Autorização:** Sistema de login para administradores e autenticação para acesso a rotas protegidas.
- **Limpeza Automática:** Uso de cron jobs para limpeza periódica de tokens inválidos.
- **Compressão de Dados:** Melhoria na performance através da compressão de arquivos.
- **Segurança:**
  - Helmet para proteção de cabeçalhos HTTP.
  - Controle de acesso com autenticação JWT e rate limiting para evitar abusos.

---

#### **Tecnologias Utilizadas**

- **Node.js** e **Express**: Estrutura principal do servidor.
- **MongoDB**: Banco de dados para armazenar as informações de ofertas e avaliações.
- **Celebrate (Joi)**: Validação de dados nos endpoints.
- **Cors e Helmet**: Segurança nas requisições e proteção de cabeçalhos.
- **Node-Cron**: Tarefas agendadas para manutenção automatizada.
- **Compressão**: Para lidar com grandes volumes de dados, como imagens.
- **Rate Limiter**: Prevenção de ataques de força bruta.
- **Loggers**: Registros centralizados de requisições e erros.

---

#### **Instalação**

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/iorecode/serg-tour-backend.git
   cd serg-tour_backend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com os seguintes parâmetros:

   ```
   PORT=3000
   MONGO_URI=sua_string_de_conexao_mongodb
   NODE_ENV=development
   JWT_SECRET=sua_chave_secreta
   ```

4. **Inicie o servidor:**
   ```bash
   npm start
   ```
   O servidor estará rodando em `http://localhost:3000`.

---

#### **Endpoints Principais**

1. **Ofertas**

   - `GET /offers/`: Lista todas as ofertas.
   - `POST /offers/`: Adiciona uma nova oferta (rota protegida).

2. **Avaliações**

   - `GET /reviews/all`: Retorna todas as avaliações.
   - `GET /reviews/top`: Retorna as melhores avaliações.
   - `POST /review`: Adiciona uma nova avaliação.

3. **Administração**
   - `POST /admins/login`: Login de administrador com rate limiting.
   - Rotas protegidas para gerenciar ofertas e avaliações.

---

#### **Testes**

- Este projeto foi desenvolvido com suporte para ambiente de testes. Certifique-se de configurar `NODE_ENV=test` e uma base de dados específica para testes no arquivo `.env`.

---

#### **Licença**

Este projeto está licenciado sob a [MIT License].
