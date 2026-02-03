// Backend Mockado - Investgram
// Rede Social para Investidores
const http = require('http');
const url = require('url');
const crypto = require('crypto');

// Banco de dados em memória
const db = {
  users: [],
  posts: [],
  likes: [],
  comments: []
};

// Usuários iniciais
db.users = [
  { id: '1', name: 'Felipe Amorim', email: 'famorim@bvp.com', companies: ['Stripe', 'Ramp', 'Brex'] },
  { id: '2', name: 'Ana Silva', email: 'ana@venture.com', companies: ['Nubank', 'Stone', 'PagSeguro'] },
  { id: '3', name: 'Carlos Mendes', email: 'carlos@invest.com', companies: ['Tesla', 'SpaceX', 'Nvidia'] }
];

// Posts iniciais
db.posts = [
  { id: '1', userId: '1', company: 'Stripe', createdAt: new Date('2024-01-15').toISOString() },
  { id: '2', userId: '1', company: 'Ramp', createdAt: new Date('2024-01-16').toISOString() },
  { id: '3', userId: '2', company: 'Nubank', createdAt: new Date('2024-01-17').toISOString() },
  { id: '4', userId: '3', company: 'Tesla', createdAt: new Date('2024-01-18').toISOString() }
];

// Likes iniciais
db.likes = [
  { id: '1', postId: '1', userId: '2' },
  { id: '2', postId: '1', userId: '3' },
  { id: '3', postId: '2', userId: '2' }
];

// Comentários iniciais
db.comments = [
  { id: '1', postId: '1', userId: '2', text: 'Excelente empresa! Crescimento impressionante.', createdAt: new Date().toISOString() },
  { id: '2', postId: '1', userId: '3', text: 'Concordo! API muito bem feita.', createdAt: new Date().toISOString() }
];

// Helpers
const generateId = () => crypto.randomBytes(16).toString('hex');

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
};

const sendJSON = (res, data, status = 200) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
};

// Rotas
const routes = {
  // GET /users - Lista todos os usuários
  'GET /users': (req, res) => {
    sendJSON(res, db.users);
  },

  // GET /users/:id - Busca usuário por ID
  'GET /users/': (req, res, id) => {
    const user = db.users.find(u => u.id === id);
    if (user) {
      sendJSON(res, user);
    } else {
      sendJSON(res, { error: 'User not found' }, 404);
    }
  },

  // POST /users - Cria novo usuário
  'POST /users': async (req, res) => {
    const body = await parseBody(req);
    const newUser = {
      id: generateId(),
      name: body.name,
      email: body.email,
      companies: body.companies || []
    };
    db.users.push(newUser);
    
    // Cria posts para cada empresa
    body.companies?.forEach(company => {
      const post = {
        id: generateId(),
        userId: newUser.id,
        company,
        createdAt: new Date().toISOString()
      };
      db.posts.push(post);
    });
    
    sendJSON(res, newUser, 201);
  },

  // GET /feed - Feed de posts com likes e comentários
  'GET /feed': (req, res) => {
    const feed = db.posts.map(post => {
      const user = db.users.find(u => u.id === post.userId);
      const postLikes = db.likes.filter(l => l.postId === post.id);
      const postComments = db.comments
        .filter(c => c.postId === post.id)
        .map(comment => ({
          ...comment,
          user: db.users.find(u => u.id === comment.userId)
        }));
      
      return {
        ...post,
        user,
        likes: postLikes.length,
        likedBy: postLikes.map(l => l.userId),
        comments: postComments
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    sendJSON(res, feed);
  },

  // POST /posts/:id/like - Dar like em um post
  'POST /posts/': async (req, res, id) => {
    if (!id.includes('/like')) return;
    const postId = id.replace('/like', '');
    const body = await parseBody(req);
    
    const existingLike = db.likes.find(l => l.postId === postId && l.userId === body.userId);
    
    if (existingLike) {
      // Remove like
      db.likes = db.likes.filter(l => l.id !== existingLike.id);
      sendJSON(res, { liked: false });
    } else {
      // Adiciona like
      const newLike = {
        id: generateId(),
        postId,
        userId: body.userId
      };
      db.likes.push(newLike);
      sendJSON(res, { liked: true });
    }
  },

  // POST /posts/:id/comment - Comentar em um post
  'POST /posts/comment': async (req, res, id) => {
    const postId = id.replace('/comment', '');
    const body = await parseBody(req);
    
    const newComment = {
      id: generateId(),
      postId,
      userId: body.userId,
      text: body.text,
      createdAt: new Date().toISOString()
    };
    db.comments.push(newComment);
    
    const user = db.users.find(u => u.id === body.userId);
    sendJSON(res, { ...newComment, user }, 201);
  }
};

// Servidor
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  try {
    // Roteamento
    const routeKey = `${method} ${path}`;
    
    if (routes[routeKey]) {
      routes[routeKey](req, res);
    } else {
      // Rotas dinâmicas com ID
      const pathParts = path.split('/').filter(p => p);
      if (pathParts.length >= 2) {
        const baseRoute = `${method} /${pathParts[0]}/`;
        if (routes[baseRoute]) {
          routes[baseRoute](req, res, pathParts.slice(1).join('/'));
        } else {
          sendJSON(res, { error: 'Route not found' }, 404);
        }
      } else {
        sendJSON(res, { error: 'Route not found' }, 404);
      }
    }
  } catch (error) {
    console.error(error);
    sendJSON(res, { error: 'Internal server error' }, 500);
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('\nEndpoints disponíveis:');
  console.log('GET    /users           - Lista usuários');
  console.log('GET    /users/:id       - Busca usuário');
  console.log('POST   /users           - Cria usuário');
  console.log('GET    /feed            - Feed de posts');
  console.log('POST   /posts/:id/like  - Like/Unlike');
  console.log('POST   /posts/:id/comment - Comentar');
});
