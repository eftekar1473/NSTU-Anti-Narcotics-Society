# NSTUANS Production Deployment Guide

**Project:** Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS)  
**Target Environments:** Vercel (Edge Frontend) & Supabase (PostgreSQL, Auth, Storage)  
**Motto:** *"Say No to Drugs, Say Yes to Life."*  

---

## 1. Production Architecture Overview

The NSTUANS website follows a modern, secure, serverless multi-tier architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC USERS & ADMINS                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (DNS: nstuans.org)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE NETWORK                             │
│  - Static Asset CDN (HTML5, CSS3, ES6 JavaScript)                     │
│  - Clean URL Rewriting (/events/:slug, /gallery/:slug, /about/goals)   │
│  - Security Headers (HSTS, CSP, X-Frame-Options, No-Sniff)             │
│  - 0 KB Framework Overhead (Vanilla JS Architecture)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / WSS (REST / RPC / Storage)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SUPABASE CLOUD PLATFORM                          │
│                                                                        │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   PostgreSQL 15+     │  │   Supabase Auth  │  │ Supabase Storage │  │
│  │  - 17 Relational Tbl │  │  - Email/Pass    │  │  - 5 Buckets     │  │
│  │  - Strict RLS Active │  │  - RBAC Claims   │  │  - File limits   │  │
│  │  - Audit Logging     │  │  - Route Guards  │  │  - MIME filters  │  │
│  └──────────────────────┘  └──────────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Pre-Deployment Prerequisites

1. **GitHub Account & Repository:** Push access to the organization repository.
2. **Vercel Account:** Free Hobby or Pro team plan at [vercel.com](https://vercel.com).
3. **Supabase Account:** Free or Pro plan at [supabase.com](https://supabase.com).
4. **Git CLI & Node.js/Python:** Installed on the deployment workstation for running test verifications.

---

## 3. Supabase Cloud Configuration (Step-by-Step)

### Step 3.1: Create a Production Project
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**.
3. Fill in:
   - **Name:** `NSTUANS-Production`
   - **Database Password:** Generate a high-entropy 24+ character password and store it in an enterprise password manager.
   - **Region:** `Southeast Asia (Singapore - ap-southeast-1)` &mdash; provides the lowest network latency (< 50ms) to Bangladesh.
   - **Pricing Plan:** Free tier or Pro.
4. Click **Create new project** and wait 2 minutes for provisioning.

### Step 3.2: Run Database Migrations in Exact Sequence
Open the Supabase **SQL Editor** tab and execute the SQL migration files in this exact order:

1. **Schema Migration:**  
   Open and execute: `supabase/migrations/20261105000001_initial_schema.sql`  
   *Creates all 17 tables, foreign keys, triggers, constraints, and indexes.*
2. **Storage Migration:**  
   Open and execute: `supabase/migrations/20261105000002_storage_setup.sql`  
   *Creates 5 storage buckets (`site-assets`, `event-images`, `leader-profiles`, `gallery-images`, `publications`) and upload file-size policies.*
3. **RLS Security Policies:**  
   Open and execute: `supabase/migrations/20261105000003_rls_policies.sql`  
   *Enforces Row Level Security on all 17 tables, creates `is_active_admin()`, `is_super_admin()`, and denies anonymous reads on student applications and messages.*
4. **Verified Baseline Seed Data:**  
   Open and execute: `supabase/seed.sql`  
   *Inserts verified organization records and safe editable placeholders.*

### Step 3.3: Create First Super Admin User
Per Section 11 of the SRS, public user registration is disabled. Super Admin accounts must be created administratively:

1. In Supabase Dashboard, navigate to **Authentication** &rarr; **Users**.
2. Click **Add User** &rarr; **Create User**.
3. Enter:
   - **Email:** `admin@nstuans.org` (or verified official administrator email)
   - **Password:** Strong temporary password
   - **Auto-Confirm Email:** Checked (`Yes`).
4. Note the generated User `UUID`.
5. Run the following snippet in the **SQL Editor** to grant Super Admin privileges:
```sql
INSERT INTO public.admin_profiles (id, full_name, email, role, is_active)
VALUES (
    'REPLACE_WITH_USER_UUID',
    'NSTUANS Administrator',
    'admin@nstuans.org',
    'super_admin',
    TRUE
)
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin', is_active = TRUE;
```

### Step 3.4: Configure Supabase Auth URLs
1. Navigate to **Authentication** &rarr; **URL Configuration**.
2. Set **Site URL** to: `https://nstuans.org` (or your Vercel deployment URL, e.g. `https://nstuans.vercel.app`).
3. Under **Redirect URLs**, add:
   - `https://nstuans.org/admin/dashboard.html`
   - `https://nstuans.org/admin/login.html`
   - `https://nstuans.vercel.app/admin/dashboard.html`
   - `http://localhost:3000/admin/dashboard.html` (for local staging)

---

## 4. Vercel Frontend Deployment (Step-by-Step)

### Step 4.1: Connect GitHub Repository
1. Push the final verified code to your GitHub repository:
   ```bash
   git push origin master
   ```
2. Log in to [vercel.com](https://vercel.com) and click **Add New...** &rarr; **Project**.
3. Select and import your `NSTUANS` repository.

### Step 4.2: Configure Project Settings
- **Framework Preset:** `Other` (Vanilla HTML/CSS/JS)
- **Root Directory:** `./`
- **Build Command:** Leave blank (no compilation required)
- **Output Directory:** Leave blank (serves repository root)

### Step 4.3: Configure Production Environment Variables
Under the **Environment Variables** section in Vercel, configure:
| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Your live Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Live Supabase Anonymous Public Key |

> [!CAUTION]
> **NEVER add the `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables or frontend files!** The public client must only ever use the `anon` key.

### Step 4.4: Deploy
Click **Deploy**. Vercel will index the site and deploy to global edge nodes within 15–30 seconds.

---

## 5. Post-Deployment Verification Checklist

Execute this verification test run immediately following live deployment:

- [ ] **Home Page:** Load `https://your-domain.org/` &mdash; verify hero section, official motto, and assets load.
- [ ] **Clean Routing:** Visit `https://your-domain.org/about/goals` and verify page loads without `.html` extension.
- [ ] **Event Detail URL:** Visit `https://your-domain.org/events/opening-ceremony` and refresh browser. Verify page loads correctly.
- [ ] **Gallery Detail URL:** Visit `https://your-domain.org/gallery/opening-ceremony` and verify lightbox viewer opens.
- [ ] **Public Contact Form:** Submit test inquiry; verify confirmation appears and data saves in `contact_messages`.
- [ ] **Public Join Us Form:** Submit test membership application; verify validation prevents bad data and submission succeeds.
- [ ] **Admin Authentication:** Navigate to `/admin/login.html`, log in with Super Admin credentials, verify redirection to `/admin/dashboard.html`.
- [ ] **Admin Applications:** Open `/admin/applications.html`, locate the test application, enter review notes, and click **Approve**.
- [ ] **Admin Messages Inbox:** Open `/admin/messages.html`, verify the test inquiry is visible, click **Read**, then **Archive**.
- [ ] **Mobile Responsiveness:** Inspect site on physical iOS and Android mobile devices.

---

## 6. Backup, Recovery & Disaster Management

1. **Automated Daily Backups:**  
   Supabase automatically takes daily WAL (Write-Ahead Log) snapshots of the PostgreSQL database.
2. **Manual Point-in-Time Dump:**  
   Admins can generate a standalone database dump at any time using `pg_dump`:
   ```bash
   pg_dump "postgres://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > nstuans_backup_$(date +%Y%m%d).sql
   ```
3. **Storage Asset Redundancy:**  
   Keep local archival backups of all high-resolution event and club branding photographs in the designated `Resources/` archive directory.
4. **Rollback on Vercel:**  
   In the event of an unintended frontend regression, navigate to **Deployments** on Vercel, select the previous stable deployment, and click **Instant Rollback**.
