# NSTU Anti-Narcotics Society (NSTUANS) - Official Website

> **Motto:** *"Say No to Drugs, Say Yes to Life."*

The official web platform for the **Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS)**. This student-led organization is dedicated to fostering a drug-free, informed, and socially conscious university campus and broader community.

---

## 📌 Project Overview

This repository houses the complete source code for the NSTUANS web platform, comprising a responsive public-facing portal and a secure role-based administrative dashboard.

- **Client Technology:** HTML5, CSS3, Vanilla JavaScript (zero external heavyweight frontend frameworks like React or Next.js to ensure lightning performance, minimal footprint, and direct standards compliance).
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Supabase Storage, and Supabase Edge Functions).
- **Deployment Platform:** [Vercel](https://vercel.com/) (with clean URL rewrite routing).
- **Repository Management:** GitHub.

---

## 🏗️ Architecture & Folder Structure

The project maintains a strict separation of concerns between public visitor pages, protected administrative workflows, reusable UI components, and backend database migrations:

```text
NSTUANS/
├── index.html                   # Public Homepage
├── about/                       # About sections
│   ├── index.html               # About overview & Who We Are
│   ├── mission.html             # Mission Statement
│   ├── vision.html              # Vision Statement
│   ├── history.html             # Journey & Historical Milestones
│   └── goals.html               # 7 Organizational & 7 Research Goals
├── events/                      # Events portal
│   ├── index.html               # Upcoming and past events catalog
│   └── details.html             # Event detail dynamic view
├── leaders/                     # Leadership & Committee
│   └── index.html               # Advisors, Executive Committee, batch profiles
├── gallery/                     # Media & Photo Gallery
│   └── index.html               # Albums catalog and image lightbox viewer
├── contact/                     # Contact & Office channels
│   └── index.html               # Inquiry form and physical location details
├── join-us/                     # Membership Application Portal
│   └── index.html               # Online student membership application form
├── admin/                       # Private Admin Dashboard
│   ├── login.html               # Secure administrator authentication
│   ├── dashboard.html           # Main administrative overview & analytics
│   ├── events.html              # Event publishing & management
│   ├── leaders.html             # Executive committee & advisor management
│   ├── gallery.html             # Gallery album creation & image upload
│   ├── applications.html        # Membership application review & status workflow
│   ├── messages.html            # Contact inquiry inbox
│   └── settings.html            # General site configuration & profile settings
├── assets/                      # Static resources
│   ├── images/                  # Club logo, photography, and illustrations
│   ├── icons/                   # SVG and vector iconography
│   └── fonts/                   # Web fonts
├── css/                         # Modular CSS3 Stylesheets
│   ├── global.css               # Global reset, base tags, utilities
│   ├── variables.css            # Color tokens, typography scales, spacing
│   ├── components.css           # Buttons, cards, modals, form inputs, loaders
│   ├── responsive.css           # Adaptive breakpoint rules
│   ├── public/                  # Public page specific styles
│   └── admin/                   # Admin dashboard layout and table styles
├── js/                          # Modular Vanilla JavaScript
│   ├── config/                  # Supabase credentials & app runtime config
│   ├── services/                # Supabase API clients (events, leaders, auth, etc.)
│   ├── components/              # Shared UI components (navbar, footer, toast, modals)
│   ├── public/                  # Public interaction handlers
│   ├── admin/                   # Admin auth guard, forms, and CRUD logic
│   └── utils/                   # Sanitization, date formatters, slugifiers
├── supabase/                    # Supabase backend definitions
│   ├── migrations/              # PostgreSQL DDL migrations with RLS policies
│   ├── seed.sql                 # Baseline verified organizational seed data
│   └── functions/               # Supabase Edge Functions (e.g. anti-abuse, emails)
├── tests/                       # Unit, integration, and security test suites
├── docs/                        # Complete technical documentation
│   └── NSTUANS-SRS.md           # Approved Software Requirements Specification
├── .env.example                 # Frontend-safe configuration environment template
├── .gitignore                   # Version control exclusion rules
└── README.md                    # Project documentation entry point
```

---

## 🎨 UI/UX Design System

The visual design system adheres to an academic, trustworthy, and modern university society theme:

- **Deep Green (`#102C2B`):** Dominant brand tone for headers, primary action bars, and navigation accents.
- **Gold (`#D9A441`):** Highlights, call-to-action buttons (e.g., *Join Us*), and badges.
- **Off-white (`#F5F7F4`):** Soft, high-readability page and card backgrounds.
- **Dark Text (`#263238`):** Clean typography providing optimal contrast and readability.

### Main Navigation Requirements
The public navigation strictly enforces a 6-item order:
1. **About** (with dropdown: *Who We Are*, *Mission*, *Vision*, *History*, *Goals*)
2. **Events**
3. **Leaders**
4. **Gallery**
5. **Contact**
6. **Join Us** (High-emphasis Call to Action)

---

## 🔒 Security & Data Integrity

1. **Row Level Security (RLS):** All 17 PostgreSQL tables enforce granular RLS policies. Public visitors have read-only access to published content (`status = 'published'`).
2. **Zero Privileged Keys on Frontend:** The browser only receives `SUPABASE_ANON_KEY`. Supabase service-role keys and administrative master tokens are strictly excluded from all client-facing code.
3. **Admin Authorization Guard:** The private admin portal verifies admin credentials and claims against `admin_profiles` before exposing data.
4. **Anti-Hallucination & Truthful Data:** Fictional dates, founder names, achievements, or arbitrary leaders are strictly prohibited. Unverified organizational details remain editable placeholders inside the admin portal.

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari).
- A static local server (e.g., Live Server in VS Code, `npx serve`, or Python's `python -m http.server 5500`).
- A [Supabase](https://supabase.com) project.

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nstuans-website.git
   cd nstuans-website
   ```
2. Copy the environment configuration template:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your frontend-safe Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Start a local server:
   ```bash
   # Using Python 3:
   python -m http.server 5500
   ```
5. Open `http://localhost:5500` in your browser.

---

## 📋 Implementation Roadmap

- [x] **Phase 1:** Project Analysis, Architecture Definition & Folder Setup
- [ ] **Phase 2:** UI/UX Design System & Shared Components (Navbar, Footer, Modals)
- [ ] **Phase 3:** Public Website Development (Static Layouts & Responsive Pages)
- [ ] **Phase 4:** Supabase Backend & Database Setup (17 Tables, Constraints, Seeds)
- [ ] **Phase 5:** Supabase Security & Authentication (RLS Policies, Admin Auth)
- [ ] **Phase 6:** Public Website & Supabase Integration (Dynamic Data Services)
- [ ] **Phase 7:** Admin Dashboard Development (CRUD modules, Analytics)
- [ ] **Phase 8:** Membership Application & Contact Workflows
- [ ] **Phase 9:** Comprehensive Quality Assurance, Security & Performance Testing
- [ ] **Phase 10:** Production Deployment (Vercel, Environment Variables)
- [ ] **Phase 11:** Final Documentation, User Handover & Acceptance Verification
