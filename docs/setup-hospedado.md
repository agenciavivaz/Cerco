# Setup do ambiente hospedado (Supabase `cerco-sp` + Vercel `cerco`)

Passos que precisam ser feitos no painel (não há API disponível para o agente). Faça uma vez.

## 1. Vercel → projeto `cerco` → Settings → Environment Variables

Marque **Production** e **Preview** em todas.

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_APP_NAME` | `Cerco` |
| `NEXT_PUBLIC_METHOD_NAME` | `Método Comitê` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dxvnksukbmizvuxenjwz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys → **anon / publishable** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → **service_role / secret** (tipo *Sensitive* na Vercel) |
| `NEXT_PUBLIC_APP_URL` | *(opcional)* domínio de produção. Em previews, se vazio, o app usa a URL do próprio deploy. |

Opcionais (o app funciona sem): `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`.

Depois: **Redeploy** do último deploy da branch.

## 2. Supabase → Authentication → Sign In / Providers

- **Allow new users to sign up**: **desligado** (acesso só por convite).
- Email provider: ligado. "Confirm email": ligado.

## 3. Supabase → Authentication → URL Configuration

- **Site URL**: o domínio de produção da Vercel (ex.: `https://cerco-diegos-projects-ad3de0cc.vercel.app`).
- **Redirect URLs** (adicione as duas):
  - `https://*-diegos-projects-ad3de0cc.vercel.app/**` (previews)
  - `<domínio de produção>/**`

## 4. E-mail dos convites (recomendado)

O SMTP padrão do Supabase só entrega para membros da organização e tem limite baixo. Para os convites e o
magic link chegarem a qualquer pessoa: Supabase → Authentication → **SMTP Settings** → usar o SMTP do Resend
(`smtp.resend.com`, porta 465, usuário `resend`, senha = API key do Resend, remetente de um domínio verificado).

Enquanto isso não estiver configurado, use **"Gerar novo link de acesso"** na tela do usuário no ADM e envie o
link por outro canal (DEC-008).

## 5. Primeiro acesso do ADM

O e-mail do primeiro ADM já está em `platform_settings['bootstrap.admin_emails']` no banco hospedado (DEC-016).

1. Supabase → Authentication → Users → **Invite user** → o e-mail do ADM.
2. Abra o link do e-mail → o app pede para **definir a senha** → você cai na Área ADM.

(Alternativa sem e-mail: `ENV_FILE=<arquivo com as chaves do hospedado> pnpm admin:bootstrap <email>` imprime um link de acesso.)
