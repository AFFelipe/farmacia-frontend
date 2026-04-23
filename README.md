# ⚕️ FarmaSystem — Guia de Deploy

## Estrutura
```
farmacia-backend/   → Node.js + Express + Mongoose
farmacia-frontend/  → PWA (HTML/CSS/JS)
```

---

## 1. MongoDB Atlas
1. Acesse cloud.mongodb.com → crie cluster gratuito M0
2. Crie usuário em **Security > Database Access**
3. Libere rede em **Security > Network Access** → Allow from Anywhere
4. Copie a connection string e adicione o banco:
```
mongodb+srv://usuario:senha@cluster.mongodb.net/farmacia?retryWrites=true&w=majority
```

---

## 2. Backend → Render
```bash
cd farmacia-backend
git init && git add . && git commit -m "feat: initial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/farmacia-backend.git
git push -u origin main
```
No Render: **New > Web Service** → conecte o repo
- Build: `npm install` | Start: `npm start`
- Env: `MONGO_URI` = sua string do Atlas

---

## 3. Frontend → GitHub Pages
1. Edite `app.js` linha 3: troque `API_BASE` pela URL do Render
```bash
cd farmacia-frontend
git init && git add . && git commit -m "feat: initial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/farmacia-frontend.git
git push -u origin main
```
No GitHub: **Settings > Pages** → Source: branch `main` / root

---

## 4. Rotas da API

### Clientes `/api/clientes`
| Método | Rota | Ação |
|--------|------|------|
| GET | `/api/clientes` | Lista todos |
| GET | `/api/clientes?search=nome` | Busca |
| GET | `/api/clientes/:id` | Busca por ID |
| POST | `/api/clientes` | Cria |
| PUT | `/api/clientes/:id` | Atualiza |
| DELETE | `/api/clientes/:id` | Remove |

### Receitas `/api/receitas`
| Método | Rota | Ação |
|--------|------|------|
| GET | `/api/receitas` | Lista todas |
| GET | `/api/receitas?cliente=ID` | Filtra por cliente |
| GET | `/api/receitas/:id` | Busca por ID |
| POST | `/api/receitas` | Cria |
| PUT | `/api/receitas/:id` | Atualiza |
| DELETE | `/api/receitas/:id` | Remove |

---

## 5. Checklist de Entrega
- [ ] Repositório `farmacia-backend` no GitHub
- [ ] Repositório `farmacia-frontend` no GitHub
- [ ] MongoDB Atlas configurado
- [ ] Backend publicado no Render
- [ ] Frontend publicado no GitHub Pages
- [ ] CRUD completo de Clientes
- [ ] CRUD completo de Receitas Médicas (nova entidade)
- [ ] PWA instalável
