# Investgram - Rede Social para Investidores 🚀

Uma rede social completa para investidores compartilharem suas empresas favoritas, com sistema de likes e comentários.

## 🎯 Funcionalidades

- ✅ Cadastro de usuários com nome e email
- ✅ Lista de empresas favoritas por usuário
- ✅ Feed de posts com empresas
- ✅ Sistema de likes
- ✅ Sistema de comentários
- ✅ Visualização de perfis de outros usuários
- ✅ Interface Bootstrap responsiva
- ✅ Backend mockado em memória

## 🛠️ Tecnologias

### Backend
- Node.js (HTTP puro, sem frameworks)
- Banco de dados em memória
- API RESTful

### Frontend
- React 18 (via CDN)
- Bootstrap 5
- Bootstrap Icons
- Babel Standalone

## 🚀 Como Executar

### 1. Iniciar o Backend

```bash
cd investgram
node server.js
```

O servidor estará rodando em `http://localhost:3001`

### 2. Abrir o Frontend

Abra o arquivo `index.html` diretamente no navegador ou use um servidor local:

```bash
# Opção 1: Abrir diretamente
open index.html

# Opção 2: Usar servidor Python
python3 -m http.server 8000
# Acesse: http://localhost:8000

# Opção 3: Usar servidor Node
npx serve .
```

## 📡 API Endpoints

### Usuários
- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário específico
- `POST /users` - Cria novo usuário
  ```json
  {
    "name": "Nome do Usuário",
    "email": "email@exemplo.com",
    "companies": ["Empresa 1", "Empresa 2"]
  }
  ```

### Feed e Interações
- `GET /feed` - Lista todos os posts com likes e comentários
- `POST /posts/:id/like` - Dar/remover like
  ```json
  {
    "userId": "user-id"
  }
  ```
- `POST /posts/:id/comment` - Adicionar comentário
  ```json
  {
    "userId": "user-id",
    "text": "Texto do comentário"
  }
  ```

## 🎨 Interface

A aplicação possui:

- **Navbar**: Navegação e seleção de usuário
- **Feed**: Lista de posts com empresas, likes e comentários
- **Perfil**: Visualização de perfis com empresas favoritas
- **Novo Usuário**: Formulário de cadastro

## 👥 Usuários Pré-cadastrados

1. **Felipe Amorim** (famorim@bvp.com)
   - Empresas: Stripe, Ramp, Brex

2. **Ana Silva** (ana@venture.com)
   - Empresas: Nubank, Stone, PagSeguro

3. **Carlos Mendes** (carlos@invest.com)
   - Empresas: Tesla, SpaceX, Nvidia

## 🔄 Fluxo de Uso

1. Abra a aplicação
2. Selecione um usuário ou crie um novo
3. Veja o feed de empresas
4. Dê likes nos posts
5. Comente nas empresas
6. Clique nos nomes para ver perfis

## 🎯 Arquitetura

### Backend (server.js)
- Servidor HTTP nativo do Node.js
- Sistema de rotas manual
- CORS habilitado
- Banco de dados em memória (arrays)

### Frontend (index.html)
- SPA (Single Page Application) em React
- Componentes: App, Feed, Post, Profile, NewUserForm
- Bootstrap para estilização
- Comunicação com API via Fetch

## 📝 Próximos Passos (Melhorias Possíveis)

- [ ] Persistência em banco de dados real (PostgreSQL, MongoDB)
- [ ] Autenticação e autorização
- [ ] Upload de imagens
- [ ] Busca de usuários e empresas
- [ ] Notificações em tempo real
- [ ] Seguir outros usuários
- [ ] Feed personalizado
- [ ] Dark mode

## 📄 Licença

MIT

---

Desenvolvido com ❤️ para a comunidade de investidores
