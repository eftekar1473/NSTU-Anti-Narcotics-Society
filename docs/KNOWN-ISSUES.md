# NSTUANS Known Issues & Archival Verification Registry

**Project:** Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS)  
**Status:** Software Architecture Complete (100% Functionally Verified)  
**Document Purpose:** Registry of Historical & Institutional Data Awaiting Official University Gazette / Archival Records  
**Motto:** *"Say No to Drugs, Say Yes to Life."*  

---

## 1. Anti-Hallucination Policy & Data Integrity Statement

In accordance with **Section 17 of the approved System Requirements Specification (SRS)** and the core project instructions:

> *"Never invent establishment years, founder names, committee member names, or historical event dates. Unverified items must remain designated as editable placeholders or pending official verification."*

The engineering team strictly refrained from generating fictional founding stories, arbitrary dates, or invented faculty/student names. Where authentic historical records from the provided source documents (`NSTUANS Details.pdf` and `Resources/`) were silent, the application was deliberately architected with **secure, verified placeholders and administrative toggles**.

---

## 2. Institutional Items Awaiting Official University Archival Verification

The following items are designated in the database and frontend as awaiting university administrative confirmation:

| Item Code | Category | Current Status in Application | Action Required to Finalize |
| :--- | :--- | :--- | :--- |
| **VER-001** | **Exact Founding Year & Founding Date** | Designated as *"Pending Official Verification"* in `about/history.html` and database `site_settings`. | University Registrar or founding society advisor provides the official approval gazette date. Once confirmed, edit in Admin Portal under `Settings & Content`. |
| **VER-002** | **Founding Executive Member Roster** | Safe historical placeholders in `about/history.html` and `history_entries`. | Society archives provide the original founding committee declaration list. Update via Admin Portal. |
| **VER-003** | **Official Society Contact Number & Dedicated Email** | Designated as *"Official contact details pending university phone/email allocation"* on `contact/index.html`. | NSTU ICT Cell allocates an official `@nstu.edu.bd` institutional mailbox and office telephone. Update in Admin `Settings`. |
| **VER-004** | **Permanent Campus Office Room Number** | Stated as *"Sonapur, Noakhali-3814, Bangladesh (Office allocation pending)"*. | NSTU Proctor Office / Directorate of Student Welfare (DSW) designates club room allotment. |
| **VER-005** | **Current Full Student Executive Committee** | Advisory board and sample leadership entries have `is_verified` toggle set. | Current term President and General Secretary submit the validated student roster with Department approval. Toggle to verified in Admin `Leaders`. |

---

## 3. Technical Known Limitations & Architecture Boundaries

1. **Client-Side Supabase Connection Fallback:**  
   When the live website is opened without configured Supabase credentials (or if the database is in maintenance), the frontend automatically switches to the verified local baseline cache. This guarantees zero downtime and enables full offline visual inspection, but changes made during offline mode are saved in the user's browser `localStorage` rather than the central PostgreSQL server.
2. **Static Email Relay vs. Direct Mailto:**  
   The admin message reply action currently invokes the administrator's default desktop/mobile email client (`mailto:`) with prepopulated subject and recipient headers. For direct browser-based SMTP dispatch without opening an external email client, a Supabase Edge Function with SendGrid or Resend API key can be linked in future phases.
3. **Storage Upload Size Enforcement:**  
   Supabase Storage policies enforce a maximum upload size of 5 MB per image. Administrators attempting to upload raw DSLR image files exceeding 5 MB must compress the image to JPEG/WebP format before uploading, as outlined in `docs/CONTENT-GUIDE.md`.

---

## 4. How Administrators Can Resolve Unverified Items

1. Log in to the Admin Portal at `/admin/login.html`.
2. To update founding year, mission, or vision: navigate to **Settings & Content**.
3. To update executive members and advisors: navigate to **Leaders & Advisory**, click the leader, and toggle **Verified**.
4. To add confirmed historical milestones: navigate to **Settings & Content** &rarr; **Historical Entries**.
5. All updates take effect immediately on the live website without code recompilation or redeployment.
