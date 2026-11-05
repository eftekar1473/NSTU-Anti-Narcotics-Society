# NSTU Anti-Narcotics Society (NSTUANS) - Official Website

> **Official Motto:** *"Say No to Drugs, Say Yes to Life."*

The official web platform for the **Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS)**. NSTUANS is a university-based student welfare and peer advocacy organization dedicated to building a conscious, healthy, and drug-free campus community through awareness rallies, scientific seminars, empirical substance abuse research, and student peer mentorship.

---

## 📌 Project Overview

This repository contains the complete production-ready source code for the NSTUANS web platform, comprising a responsive public-facing portal and a private administrative dashboard.

- **Frontend Technology:** Semantic HTML5, CSS3 Variables, Modular Vanilla ES6 JavaScript (Zero external heavyweight framework runtime overhead; 0 KB React/Next.js dependencies).
- **Backend Infrastructure:** [Supabase](https://supabase.com/) (PostgreSQL 15+, Supabase Auth, 5 Supabase Storage Buckets).
- **Deployment Platform:** [Vercel](https://vercel.com/) (with clean URL rewrite routing and enterprise security headers via `vercel.json`).
- **Data Protection:** Granular PostgreSQL Row Level Security (RLS) across all 17 tables; zero exposure of student applicant data or private contact messages.
- **Data Integrity Discipline:** Strict anti-hallucination compliance. Unverified dates, founder names, and phone numbers remain designated as pending verification rather than invented.

---

## 📂 Repository Layout & Architecture

```text
NSTUANS/
├── index.html                   # Official Homepage (All 11 mandatory sections)
├── vercel.json                  # Edge routing, clean URLs, and security headers
├── .env.example                 # Environment variable template (zero secrets)
├── README.md                    # Project overview and entrypoint
│
├── about/                       # About Society Sub-Pages
│   ├── index.html               # Who We Are
│   ├── mission.html             # Core Mission Statement
│   ├── vision.html              # Strategic Vision & Campus Future
│   ├── history.html             # Historical Timeline & Verified Milestones
│   └── goals.html               # 7 Organizational Goals + 7 Research Goals
│
├── events/                      # Events Module
│   ├── index.html               # Chronological events grid (Upcoming & Past)
│   └── details.html             # Dynamic event view (reads ?slug=:slug)
│
├── leaders/                     # Leadership Module
│   └── index.html               # Advisory Board & Executive Committee lists
│
├── gallery/                     # Photo Gallery Module
│   ├── index.html               # Album listing grid
│   └── details.html             # Dynamic album photo viewer + interactive lightbox
│
├── contact/                     # Contact & Campus Office
│   └── index.html               # Campus location map & inquiry form
│
├── join-us/                     # Membership Application
│   └── index.html               # Student application form & solemn pledge
│
├── admin/                       # Administrative Portal (Protected by RLS & Guards)
│   ├── login.html               # Admin authentication portal
│   ├── dashboard.html           # Live KPI metrics & recent activity feeds
│   ├── events.html              # Event CRUD & publication workflow
│   ├── leaders.html             # Executive committee & advisor management
│   ├── gallery.html             # Album & photo management
│   ├── applications.html        # Student application review & internal notes
│   ├── messages.html            # Contact inquiry inbox & email dispatch
│   └── settings.html            # Site configuration & admin user roles
│
├── assets/                      # Static Media Assets
│   └── images/                  # Verified logos, ceremony photos, speaker photos
│
├── css/                         # Design System & Responsive Styling
│   ├── variables.css            # Color palette, spacing, typography tokens
│   ├── global.css               # Reset, typography system, container utilities
│   ├── components.css           # Buttons, cards, modals, alerts, tables
│   ├── responsive.css           # Mobile (<768px), Tablet, Desktop breakpoints
│   └── admin/
│       └── dashboard.css        # Professional dashboard sidebar, KPI cards
│
├── js/                          # Modular JavaScript
│   ├── config/                  # Supabase credentials & app runtime config
│   ├── services/                # Supabase API clients (events, leaders, auth, etc.)
│   ├── components/              # Shared UI components (navbar, footer, toast, modals)
│   ├── public/                  # Public interaction handlers
│   └── admin/                   # Admin auth guard, forms, and CRUD logic
│
├── supabase/                    # Backend Infrastructure as Code
│   ├── migrations/              # 3 PostgreSQL DDL migrations with RLS policies
│   └── seed.sql                 # Baseline verified data & safe placeholders
│
├── tests/                       # Automated Quality Assurance Harnesses
│   ├── verify_phase3.py         # 13 Public pages structural integrity test
│   ├── verify_security.py       # RLS policy and credential zero-leak test
│   ├── verify_admin.py          # 8 Admin modules test
│   ├── verify_phase8.py         # Membership and contact workflows test
│   └── verify_phase9_qa.py      # End-to-end QA audit runner
│
└── docs/                        # Complete Technical & Non-Technical Handover Docs
    ├── NSTUANS-SRS.md           # Formal System Requirements Specification
    ├── PROJECT-ARCHITECTURE.md  # System Architecture & Tech Rationale
    ├── DATABASE-DOCUMENTATION.md# Schema, tables, columns, indexes, and FKs
    ├── ADMIN-GUIDE.md           # Non-technical admin operation manual
    ├── DEPLOYMENT-GUIDE.md      # Vercel and Supabase production deployment
    ├── SECURITY-GUIDE.md        # RLS, Auth, and Storage security details
    ├── CONTENT-GUIDE.md         # Content editorial & image upload guidelines
    ├── TESTING-REPORT.md        # Complete executed test results matrix
    └── KNOWN-ISSUES.md          # Archival verification items & limitations
```

---

## 🎨 UI/UX Design System

The visual design system adheres to an academic, trustworthy, and modern university society theme:
- **Deep Forest Green (`#102C2B`):** Dominant brand tone for headers, primary action bars, and hero accents.
- **Warm Gold (`#D9A441`):** Highlights, call-to-action buttons (e.g. *Join Us*), and active pills.
- **Soft Off-white (`#F5F7F4`):** Soft, high-readability page and card backgrounds.
- **Dark Text (`#263238`):** High-contrast typography providing optimal reading comfort.

### Strict Public Navbar Order (Mandatory 6 Items)
1. **About** (Dropdown: *Who We Are*, *Mission*, *Vision*, *History*, *Goals*)
2. **Events**
3. **Leaders**
4. **Gallery**
5. **Contact**
6. **Join Us** (High-emphasis Call to Action)

---

## 🚀 Quick Start Guide

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari).
- Python 3.8+ (for local HTTP preview and running test suites).

### Running Locally
```bash
# Clone repository
git clone https://github.com/your-org/nstuans-website.git
cd nstuans-website

# Start local preview server
python -m http.server 5500
```
Open `http://localhost:5500` in your web browser.

### Running Test Verification Suites
```bash
# Public pages verification (13 pages, navbar, links, images)
python tests/verify_phase3.py

# Security & Row Level Security verification
python tests/verify_security.py

# Admin dashboard modules verification (8 modules)
python tests/verify_admin.py

# Membership application and contact workflows verification
python tests/verify_phase8.py

# Complete end-to-end Quality Assurance, Responsive & Accessibility audit
python tests/verify_phase9_qa.py
```

---

## 📖 Complete Documentation Index

For detailed guides, consult the dedicated documentation in the `docs/` folder:

| Document | Purpose & Audience |
| :--- | :--- |
| [**docs/NSTUANS-SRS.md**](file:///docs/NSTUANS-SRS.md) | Official approved System Requirements Specification. |
| [**docs/PROJECT-ARCHITECTURE.md**](file:///docs/PROJECT-ARCHITECTURE.md) | Technical architecture, diagrams, module hierarchy, and threat models. |
| [**docs/DATABASE-DOCUMENTATION.md**](file:///docs/DATABASE-DOCUMENTATION.md) | PostgreSQL schema, 17 tables, foreign keys, triggers, and indexes. |
| [**docs/ADMIN-GUIDE.md**](file:///docs/ADMIN-GUIDE.md) | Non-technical handbook for society executives and advisors. |
| [**docs/DEPLOYMENT-GUIDE.md**](file:///docs/DEPLOYMENT-GUIDE.md) | Vercel and Supabase production deployment, DNS, and backups. |
| [**docs/SECURITY-GUIDE.md**](file:///docs/SECURITY-GUIDE.md) | RLS policies, role-based access control, and credential isolation. |
| [**docs/CONTENT-GUIDE.md**](file:///docs/CONTENT-GUIDE.md) | Image guidelines, dimension specs, copywriting tone, and publishing rules. |
| [**docs/TESTING-REPORT.md**](file:///docs/TESTING-REPORT.md) | 96-point executed test results matrix across desktop, tablet, and mobile. |
| [**docs/KNOWN-ISSUES.md**](file:///docs/KNOWN-ISSUES.md) | Registry of historical archival items pending university gazette verification. |

---

## 📋 Phased Implementation Status

All 11 development phases specified in the project roadmap are **100% completed, tested, and verified**:

- [x] **Phase 1: Project Analysis & Setup** &mdash; Git init, SRS transcription, folder structure, assets.
- [x] **Phase 2: UI/UX Design System & Shared Components** &mdash; Color tokens, CSS reset, components, preview harness.
- [x] **Phase 3: Public Website Development** &mdash; All 13 public pages built with strict navbar and motto.
- [x] **Phase 4: Supabase Backend & Database Setup** &mdash; 17 PostgreSQL tables, 5 storage buckets, seed data.
- [x] **Phase 5: Supabase Security & Authentication** &mdash; Granular RLS, security-definer roles, login portal.
- [x] **Phase 6: Public Website & Supabase Integration** &mdash; Dynamic data services with self-healing offline fallbacks.
- [x] **Phase 7: NSTUANS Admin Dashboard** &mdash; 7 admin modules, KPI cards, CRUD dialogs, session guards.
- [x] **Phase 8: Membership and Contact Management Workflows** &mdash; Public forms, anti-abuse, admin reviews.
- [x] **Phase 9: Complete Website Testing & Quality Assurance** &mdash; 96 test assertions passed, testing report.
- [x] **Phase 10: Production Deployment Preparation** &mdash; `vercel.json` clean rewrites, deployment guide.
- [x] **Phase 11: Final Project Documentation & Handover** &mdash; Complete technical and non-technical guides.

---

## ⚖️ License & Intellectual Property
&copy; 2026 Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS). All rights reserved. Developed in strict accordance with the approved NSTUANS SRS and AI Development Instructions.
