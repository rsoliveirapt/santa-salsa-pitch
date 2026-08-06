# Santa Salsa Brooklyn — Interactive Pitch Application

### ⚠️ Nota para o SQL Editor do Supabase:
Copia **apenas o código SQL** abaixo (não copies as aspas ``` ou a palavra sql):

```sql
create table if not exists cachorros_pitch (
  id uuid default gen_random_uuid() primary key,
  ingredientes jsonb not null,
  nivel_caracas int not null,
  criado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Permitir acesso público de Inserção e Leitura (RLS)
alter table cachorros_pitch enable row level security;

drop policy if exists "Permitir leitura pública" on cachorros_pitch;
create policy "Permitir leitura pública" on cachorros_pitch for select using (true);

drop policy if exists "Permitir inserção pública" on cachorros_pitch;
create policy "Permitir inserção pública" on cachorros_pitch for insert with check (true);

drop policy if exists "Permitir eliminação pública" on cachorros_pitch;
create policy "Permitir eliminação pública" on cachorros_pitch for delete using (true);


-- Garantir transmissão completa de eventos no Realtime
alter table cachorros_pitch replica identity full;

-- Ativar Realtime na tabela (ignorar se já adicionado)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'cachorros_pitch'
  ) then
    alter publication supabase_realtime add table cachorros_pitch;
  end if;
end $$;
```



---

## 🌭 Sobre o Projeto

Aplicação Web Full-Stack interativa em **React**, **Tailwind CSS v4** e **Supabase Realtime** desenhada para a apresentação/pitch do restaurante de comida de rua venezuelana **"Santa Salsa Brooklyn"**.

### Vistas Principais:
1. **Vista Mobile (`/`) — "Build Your Perro"**:
   - Para a audiência no telemóvel criar e personalizar o seu *Perro Caliente* em tempo real.
   - Inclui o componente visual dinâmico do Hot Dog com camadas sobrepostas (Pão, Salsicha, Repolho Picado, Queijo Branco Ralado, Batata Palha, Molho de Alho, Molho de Milho Doce e Salsa Rosada).
   - Progresso em tempo real ("Nível Caracas" de 0% a 100%).
   - Animação de sucesso (confetes) e confirmação *"O teu Perro já está no ecrã do Pitch!"*.

2. **Vista Pitch (`/pitch`) — "Live Wall of Perros"**:
   - Otimizado para ecrãs grandes / projetores (16:9).
   - Gerador de QR Code com link direto para a aplicação.
   - Contador dinâmico em tempo real de Perros criados ao vivo.
   - Mosaico/Grelha viva ligada ao Supabase Realtime via `postgres_changes` (event: `INSERT`).
   - Modo de simulação local / Broadcast fallback ativado automaticamente para testes de demonstração.

---

## 🛠️ Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Testar em dois separadores:**
   - Abre `http://localhost:5173/` no primeiro separador (Vista Mobile).
   - Abre `http://localhost:5173/pitch` no segundo separador (Vista Pitch Wall).
   - Ao clicares em "Enviar para o Pitch" no telemóvel, o novo Perro surgirá instantaneamente no ecrã do Pitch!

---

## ⚡ Configuração Supabase

Podes configurar o Supabase de duas formas:

1. **Ficheiro `.env.local`:**
   ```env
   VITE_SUPABASE_URL=https://teu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=tua-chave-anonima
   ```

2. **Directamente no Ecrã do Pitch (`/pitch`):**
   - Clica no botão **"Local Realtime Mode" / "Supabase"** no cabeçalho do Pitch view para introduzir o URL e Anon Key directamente na interface.

---

## 🎨 Estética & Design System

- **Tema:** Dark mode urbano inspirado na cultura de street art, skate e street food de Brooklyn.
- **Cores:** Fundo `#121212`, Vermelho Neon `#E50914`, Amarelo Mostarda `#FFC107`, Verde Caracas `#4E9F3D` e Branco.
- **Tipografia:** Bebas Neue, Permanent Marker e Outfit.
