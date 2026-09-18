# VitaTrack

Aplicativo pessoal de acompanhamento de evolução corporal, alimentação e ingestão de proteínas.

## Tecnologias

- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express
- **Banco de Dados:** LibSQL (Turso) / SQLite local
- **Hospedagem:** Vercel

## Como rodar localmente

```bash
npm install
npm run dev
```

## Variáveis de Ambiente (Vercel)

```
TURSO_DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=seu-token
JWT_SECRET=sua-chave-secreta
```
