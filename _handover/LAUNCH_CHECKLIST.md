# THE FIRST 90 — LAUNCH CHECKLIST

This is everything you need to do outside Claude Code to get the app live. Work through it in order. Most of it is one-time setup.

---

## 1. ACCOUNTS YOU NEED

Before you write any code, create accounts for:

- **Supabase** (supabase.com) — free tier
- **Vercel** (vercel.com) — free tier, sign in with GitHub
- **GitHub** (github.com) — free, you'll push code here
- **Google Cloud Console** (console.cloud.google.com) — free, needed for Google sign-in

Use the same business email for all four. Recommend `ben@newageman.com` or whatever your primary domain email is.

---

## 2. DOMAIN SETUP

You'll need to decide where the app lives.

### Option A: Subdomain (recommended)
`journal.newageman.com` — clean, branded, separate from main site.

### Option B: Path
`newageman.com/journal` — requires more setup if main site isn't on Vercel.

### Option C: Standalone
`thefirst90.com` — branded standalone, harder to connect to ecosystem.

**Recommendation: subdomain.** Goes live in 5 minutes via Vercel, doesn't touch your main site.

### To set up the subdomain
1. In Vercel project settings → Domains, add `journal.newageman.com`.
2. Vercel gives you a CNAME record.
3. In your DNS provider (wherever newageman.com is hosted — likely GoDaddy, Cloudflare, Namecheap, or your website host), add the CNAME record.
4. Wait 5-15 minutes for DNS to propagate.
5. Vercel auto-issues an SSL certificate. Done.

---

## 3. SUPABASE PROJECT SETUP

### Create the project
1. Sign in at supabase.com
2. New project → name it `the-first-90` → set a strong DB password (save it)
3. Choose a region close to most users (Asia Pacific - Sydney for Australian audience)
4. Wait 2 minutes for provisioning

### Get your keys
In project settings → API:
- `Project URL` → goes into `NEXT_PUBLIC_SUPABASE_URL`
- `anon public key` → goes into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role secret key` → save this, it's only used in server-only contexts (or for direct DB admin)

### Run the schema
In SQL Editor → paste the contents of `03_SCHEMA.sql` → Run. All tables and policies are created in one go.

### Verify Row Level Security
In Database → Tables, every table should show "RLS enabled". If any don't, run:
```sql
alter table table_name enable row level security;
```

---

## 4. GOOGLE OAUTH SETUP

This is the most fiddly part. Follow it carefully.

### Step 1: Create a Google Cloud project
1. Go to console.cloud.google.com
2. Top-left dropdown → New Project → name it `the-first-90`
3. Wait for the project to be created → switch to it

### Step 2: Enable the necessary APIs
1. APIs & Services → Library
2. Search "Google+ API" or "People API" → Enable

### Step 3: Configure OAuth consent screen
1. APIs & Services → OAuth consent screen
2. User type: External → Create
3. Fill in:
   - App name: The First 90
   - User support email: your email
   - App logo: optional but nicer with one
   - Application home page: https://journal.newageman.com
   - Application privacy policy: https://newageman.com/privacy (you'll need this)
   - Application terms of service: https://newageman.com/terms (you'll need this)
   - Authorised domains: newageman.com
   - Developer contact: your email
4. Save and continue
5. Scopes screen: skip (default profile and email scopes are enough)
6. Test users: add yourself
7. Submit

### Step 4: Create OAuth credentials
1. APIs & Services → Credentials → Create Credentials → OAuth client ID
2. Application type: Web application
3. Name: The First 90 — Web
4. Authorised JavaScript origins:
   - `https://journal.newageman.com`
   - `http://localhost:3000` (for dev)
5. Authorised redirect URIs:
   - `https://[your-project-id].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (if you handle locally)
6. Create → save the Client ID and Client Secret

### Step 5: Connect Google to Supabase
1. In Supabase → Authentication → Providers → Google
2. Toggle Enabled
3. Paste the Client ID and Client Secret from Google
4. Save
5. The redirect URL Supabase generates should match the one you put into Google Cloud. If not, update Google Cloud.

### Step 6: Move out of test mode (when ready)
Until you publish your OAuth consent screen, only test users can sign in. Before launch:
1. OAuth consent screen → Publish App
2. You may need to verify your domain (Search Console)
3. For sensitive scopes, Google review can take 4-6 weeks. For basic email/profile scopes, you're usually fine immediately.

---

## 5. VERCEL DEPLOYMENT

### First deploy
1. Push your code to a GitHub repo
2. In Vercel → New Project → Import from GitHub → select the repo
3. Framework preset: Next.js (auto-detected)
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

Vercel gives you a URL like `the-first-90.vercel.app`. Visit it. Should work.

### Connect your domain
1. Vercel project → Settings → Domains → Add `journal.newageman.com`
2. Add the CNAME at your DNS provider
3. SSL auto-issues

### Enable preview deployments
Every PR gets a preview URL. Useful for testing before merging.

---

## 6. PRIVACY POLICY & TERMS

Required for Google OAuth approval and just basic responsibility. Both should live at:
- `https://newageman.com/privacy`
- `https://newageman.com/terms`

You can either:
- Use a generator (TermsFeed, iubenda — free tier works)
- Pay a lawyer for proper Australian Privacy Act compliance (recommended for serious launch — $300-800)

Key things the privacy policy must cover:
- What data you collect (email, name from Google, journal content)
- That journal content is encrypted and not shared
- That the founder cannot access journal content (this is a major brand promise — make it explicit)
- How long data is retained
- How users can request deletion
- Contact email for privacy queries

---

## 7. INVITE CODE GENERATION

Once the app is live, you need a workflow for generating codes when clients buy a NAM program.

### Option A: Manual (simple, fine for low volume)
1. Open Supabase SQL editor
2. Run:
```sql
insert into invite_codes (code, program_source, is_active)
values
  ('NAM-' || upper(substring(md5(random()::text) from 1 for 6)), 'entry_point', true);
```
3. Copy the generated code from `invite_codes` table
4. Send it to the client manually

### Option B: Batch generation (better)
Run this to generate 50 codes at once:
```sql
insert into invite_codes (code, program_source, is_active)
select 'NAM-' || upper(substring(md5(random()::text) from 1 for 6)),
       'entry_point',
       true
from generate_series(1, 50);
```

Then export them and have your sales / onboarding flow assign one per client.

### Option C: Integrate with your sales system (v2)
GoHighLevel webhook → Vercel API route → generate code + email it. This is a v2 build — not needed for soft launch.

---

## 8. TESTING CHECKLIST BEFORE SOFT LAUNCH

Before you give a code to a real client, walk through these flows yourself end-to-end:

- [ ] New user with valid code can sign up and reach the dashboard
- [ ] New user with invalid code sees a clean error
- [ ] New user with already-used code sees a clean error
- [ ] User can complete the line in the sand and see the printed view
- [ ] User can complete the wheel and see all 10 segments rated
- [ ] User can rate a daily morning page, leave the page, return, and see their work
- [ ] User can sign out and sign back in on a different device and see all their work
- [ ] User can fall behind by 5 days, return, and the dashboard surfaces the reset page
- [ ] Habit grid ticks save and persist across sessions
- [ ] Phase 1 reset gates phase 2 entry (can't skip)
- [ ] Sunday review surfaces on Sunday after evening completion
- [ ] Day 90 routes to the final review and post-90 wheel
- [ ] On mobile, every input is reachable and the keyboard doesn't cover the next button
- [ ] On a slow connection, save indicator behaves correctly (saving → saved)
- [ ] Edge: user signs up at 11:55pm — day count handles correctly across midnight

---

## 9. SOFT LAUNCH PLAN

1. Pick 3-5 clients you trust who are already in NAM
2. Tell them: "This is the new digital version of THE FIRST 90. You're the first to use it. I want raw feedback."
3. Generate codes, send personal emails with the code and a link to `journal.newageman.com/signup`
4. Schedule a 15-minute call with each at day 14 to get feedback
5. Fix issues
6. Open up wider once 5 clients have completed at least 2 weeks without major issues

---

## 10. ONGOING OPERATIONS

### Backups
Supabase auto-backs up daily on the free tier. Upgrade to paid tier ($25/mo) once you have paying clients for point-in-time recovery.

### Monitoring
- Vercel dashboard shows traffic, errors, build status
- Supabase dashboard shows DB size, query performance, auth users
- Set up email alerts for errors (Vercel has this in the integrations panel)

### Cost projections
| Tier | Users | Monthly cost |
|------|-------|--------------|
| Free | 0-100 active | $0 |
| Supabase Pro | 100-1000 | $25 |
| Vercel Pro | When traffic warrants | $20 |
| Total at scale | 1000+ | ~$50/mo |

Below 100 active users, you're at $0/month. This is a wildly cheap stack to operate.

---

## 11. WHAT TO DO IF SOMETHING BREAKS

### Auth not working
- Check Google OAuth credentials are correct in Supabase
- Check redirect URI in Google matches Supabase's callback URL exactly
- Check OAuth consent screen is published (or user is added as test user)

### Database errors
- Check RLS policies allow the operation
- Check the user is authenticated (`auth.uid()` is not null)
- Check column names and types match what the app is sending

### Deploy fails
- Check `npm run build` works locally first
- Check env vars are set in Vercel
- Read the build log — Vercel is verbose

### A client can't sign in
- Check their code in the `invite_codes` table — is it active and unused?
- Check they're using Google with the email tied to their NAM purchase (or any Google account, since the code is what gates access, not the email)
- If you need to manually unlock a code: `update invite_codes set used_by = null, used_at = null where code = 'NAM-XXXXXX';`

---

## YOU'RE READY TO BUILD

Once you've worked through this list, the infrastructure is ready. Open Claude Code and paste the opening prompt from `05_CLAUDE_CODE_PROMPT.md`.
