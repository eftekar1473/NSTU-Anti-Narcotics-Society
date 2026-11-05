# NSTUANS Security & Authentication Guide

---

## 1. Executive Security Architecture

The security architecture of the **NSTU Anti-Narcotics Society (NSTUANS)** website is built on a **defense-in-depth model**:

1. **Database-Level Row Level Security (RLS):** All data access rules are enforced directly by PostgreSQL inside Supabase, guaranteeing that public clients cannot read private data or tamper with records regardless of frontend code.
2. **Strict Anonymous/Public Key Usage:** The frontend JavaScript bundle operates exclusively via `SUPABASE_ANON_KEY`. Privileged credentials, database connection strings, and the `service_role` key are strictly absent from all client bundles and repository commits.
3. **Server-Side Role Verification:** User roles are not trusted from the client or browser cookies; instead, they are computed via database `SECURITY DEFINER` functions querying the private `admin_profiles` table against the verified `auth.uid()`.
4. **No Public Admin Registration:** Administrative accounts cannot be registered publicly. They must be provisioned directly by existing Super Admins or through the Supabase console.

---

## 2. Tables Protected by RLS (100% Coverage)

All **17 core tables** have Row Level Security explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`):

| # | Table Name | Public Read | Public Insert | Public Update/Delete | Admin Access |
| :--- | :--- | :---: | :---: | :---: | :--- |
| 1 | `admin_profiles` | ❌ Denied | ❌ Denied | ❌ Denied | Super Admin (Full) / Self (Read-Only) |
| 2 | `site_settings` | ✅ Allowed | ❌ Denied | ❌ Denied | Super Admin (Update) |
| 3 | `pages` | ✅ Published Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 4 | `goals` | ✅ Active Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 5 | `history_entries` | ✅ Verified Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 6 | `events` | ✅ Published Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 7 | `event_images` | ✅ Published Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 8 | `committee_terms` | ✅ Allowed | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 9 | `committee_positions` | ✅ Allowed | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 10 | `committee_members` | ✅ Verified Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 11 | `gallery_albums` | ✅ Published Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 12 | `gallery_images` | ✅ Published Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 13 | `achievements` | ✅ Verified Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 14 | `publications` | ✅ Published Only | ❌ Denied | ❌ Denied | Content Admin & Super Admin |
| 15 | `contact_messages` | ❌ Denied | ✅ Validated Insert | ❌ Denied | Content Admin & Super Admin (Read/Update/Archive) |
| 16 | `membership_applications` | ❌ Denied | ✅ Validated Insert | ❌ Denied | Content Admin & Super Admin (Review/Status) |
| 17 | `audit_logs` | ❌ Denied | ❌ Denied | ❌ Denied | Super Admin Only (Audit Read) |

---

## 3. Granular Security Policies

### 3.1 Public Policies
- **Content Visibility:** Public visitors can read records only where `status = 'published'` (or `is_active = TRUE` / `is_verified = TRUE`).
- **Private Submissions:**
  - `membership_applications`: Public can INSERT valid applications (`full_name`, `student_id`, `department`, `session`, `email`, `phone`, `motivation`). Public SELECT is explicitly rejected by policy, preventing students or attackers from reading others' applications.
  - `contact_messages`: Public can INSERT inquiries with length validations. Public SELECT is completely denied.
- **Student Privacy:** Private committee member fields (`student_id`, `email`) are restricted to administrative views.

### 3.2 Role-Based Access Control (RBAC)
Role definitions in `admin_profiles`:
1. **`super_admin`:**
   - Full access across all 17 tables.
   - Manages administrator accounts, assigns roles, and activates/deactivates accounts.
   - Updates global site settings and system parameters.
   - Inspects system `audit_logs`.
2. **`content_admin`:**
   - Creates, edits, publishes, and archives events, gallery albums, committee members, and pages.
   - Reviews membership applications and manages contact inquiries.
   - Cannot create other administrators, alter admin roles, or modify system audit logs.

### 3.3 Storage Policies
Buckets: `site-assets`, `event-images`, `leader-profiles`, `gallery-images`, `publications`.
- **Public:** Can SELECT/download assets from approved public buckets.
- **Admins:** Only authenticated administrators with `is_active_admin() = true` can upload (`INSERT`), replace (`UPDATE`), or delete (`DELETE`) assets.
- **Constraints:** Uploads enforce MIME-type whitelists (e.g. `image/jpeg`, `image/png`, `application/pdf`) and size ceilings (5 MB – 25 MB).

---

## 4. Frontend Security Checklist

- [x] Zero service-role keys in frontend JavaScript.
- [x] Client initialization uses only `SUPABASE_ANON_KEY`.
- [x] `admin/login.html` rejects invalid credential submissions and handles expired sessions.
- [x] Route guard `NSTUANS_Auth.requireAuth()` intercepts unauthenticated visitors accessing private dashboard routes.
- [x] Anti-spam honeypot fields integrated on all public submission forms.
- [x] Form validation prevents empty payloads and malformed email/phone formats prior to submission.
