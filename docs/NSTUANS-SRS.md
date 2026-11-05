# Software Requirements Specification (SRS)
## Official Website of Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS)

---

### 1. Project Overview

| Item | Specification |
| :--- | :--- |
| **Project Name** | NSTUANS Official Website |
| **Organization** | Noakhali Science and Technology University Anti-Narcotics Society |
| **Short Name** | NSTUANS |
| **Project Type** | Dynamic organizational website with Admin Dashboard |
| **Primary Language** | English |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Supabase |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | Supabase Auth |
| **File Storage** | Supabase Storage |
| **Backend Functions** | Supabase Edge Functions (when required) |
| **Frontend Deployment** | Vercel |
| **Source Code Management** | GitHub |
| **Design Reference** | `https://nstusc.org/about` (quality inspiration, not direct copy) |

#### 1.1 Project Purpose
The purpose of this project is to develop an official, modern, responsive, and dynamic website for the Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS).

The website will:
- Introduce NSTUANS and its activities.
- Communicate the organization's mission, vision, history, and goals.
- Display events and activities.
- Introduce the organization's leaders and committee members.
- Maintain a photo gallery.
- Provide contact information.
- Allow interested students to apply for membership.
- Provide an administrative dashboard for managing website content.

#### 1.2 Main Project Objectives
1. Establish an official online presence for NSTUANS.
2. Make organizational information accessible to students and visitors.
3. Publish verified events and activities.
4. Present leadership and committee information.
5. Encourage student participation through the Join Us section.
6. Allow authorized administrators to manage content without editing source code.
7. Make the website easy to maintain and extend in the future.

---

### 2. Organization Information and Content

#### 2.1 Official Organization Name
**Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS)**

#### 2.2 About NSTUANS
The Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS) is a student-led organization committed to building a drug-free, aware, and socially responsible university community. The society aims to raise awareness about the harmful effects of narcotics and substance abuse while encouraging students to make informed and responsible choices.

Through awareness campaigns, educational seminars, workshops, research initiatives, and community engagement, NSTUANS seeks to promote a healthy lifestyle and strengthen the role of young people in preventing drug abuse.

We believe that a drug-free society begins with awareness, education, responsibility, and collective action. Our mission goes beyond the university campus, aspiring to contribute to a safer, healthier, and more conscious society.

#### 2.3 Official Motto
> **"Say No to Drugs, Say Yes to Life."**

#### 2.4 Mission and Vision
The website supports editable Mission and Vision content. The following are proposed drafts awaiting official organizational confirmation:
- **Proposed Mission:** To raise awareness about narcotics and substance abuse through education, research, awareness campaigns, and community engagement while encouraging students to make responsible choices.
- **Proposed Vision:** To build a drug-free, aware, healthy, and socially responsible university community and contribute to a safer society.

#### 2.5 History and Journey
The organizational details contain placeholders for:
- Establishment year
- Founder or founders' names
- Five major events or initiatives
- Significant achievements and activities

*Rule: These details must be entered by an authorized administrator after verification. The website must NOT display invented dates, founder names, or event records.*

#### 2.6 Organizational Goals of NSTUANS
1. **A Drug-Free Campus:** Promote a safe, healthy, and drug-free environment within the university.
2. **Raising Awareness:** Educate students about the physical, psychological, social, and economic consequences of drug abuse.
3. **Empowering Youth:** Encourage students to become responsible leaders and advocates of anti-narcotics initiatives.
4. **Promoting Healthy Lifestyles:** Inspire young people to engage in positive activities, sports, education, and creative pursuits.
5. **Strengthening Community Engagement:** Extend awareness initiatives beyond the campus and work with local communities.
6. **Encouraging Research and Innovation:** Promote evidence-based understanding of drug addiction, its causes, consequences, and prevention strategies.
7. **Building Partnerships:** Collaborate with educational institutions, government organizations, NGOs, and other relevant stakeholders.

#### 2.7 Research Goals
1. **Understand Drug Abuse Patterns:** Explore the prevalence, trends, and patterns of substance use among young people.
2. **Identify Risk Factors:** Investigate the social, economic, psychological, and environmental factors associated with drug abuse.
3. **Assess Social Impacts:** Examine how substance abuse affects individuals, families, educational institutions, and communities.
4. **Evaluate Awareness and Attitudes:** Study students' knowledge, perceptions, and attitudes toward narcotics and substance abuse.
5. **Explore Prevention Strategies:** Identify effective approaches to drug prevention, awareness, and rehabilitation.
6. **Promote Evidence-Based Solutions:** Conduct surveys, field studies, and research activities to support informed decision-making and policy recommendations.
7. **Encourage Academic Collaboration:** Create opportunities for students and researchers to work together on drug-related social issues.

---

### 3. Website Structure and Navigation

#### 3.1 Navbar Requirements
The navigation bar must strictly contain the following **six main items in this exact order**:
1. **About** (with dropdown)
2. **Events**
3. **Leaders**
4. **Gallery**
5. **Contact**
6. **Join Us** (visually emphasized as a CTA button)

Additional requirements:
- Organization logo on the left; clicking logo navigates to Home (`/`).
- Sticky navbar on scroll.
- Active navigation item indicator.
- Responsive mobile toggle navigation (hamburger menu).
- No additional top-level navigation items without approval.

#### 3.2 About Dropdown
- Who We Are (`/about/` or `/about/who-we-are/`)
- Mission (`/about/mission/`)
- Vision (`/about/vision/`)
- History (`/about/history/`)
- Goals (`/about/goals/`) — includes both Organizational Goals and Research Goals.

#### 3.3 Events Section
- Upcoming Events & Past Events listing.
- Event card: Featured image, title, date, short description, event status, "View Details" link.
- Event Details page: Event title, cover image, date & time, location, full description, gallery/additional images, related info.

#### 3.4 Leaders Section
- Advisory Board, Executive Committee, and other committee members.
- Profiles: Full name, photograph, designation, department, session/batch, short biography, social links.
- Committee structure and designations must be configurable by admins.

#### 3.5 Gallery Section
- Album-based photo collections with album cover, title, event/activity date.
- Image grid with modal/lightbox viewer functionality.

#### 3.6 Contact Section
- Official email, contact number (if verified), campus office address, social links.
- Public contact form saving submissions to `contact_messages`.

#### 3.7 Join Us (Membership Application)
- Membership introduction and eligibility guidelines.
- Application form fields:
  - Full Name (Text)
  - Student ID (Text)
  - Department (Select)
  - Session (Text/Select)
  - Email (Email)
  - Phone Number (Text)
  - Why do you want to join? (Textarea)
  - Agreement (Checkbox)
- Clear submission confirmation and anti-abuse protection.

---

### 4. Functional Requirements

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| **FR-001** | Visitors can access the homepage. | High |
| **FR-002** | Visitors can read About information. | High |
| **FR-003** | Visitors can view mission, vision, history, and goals. | High |
| **FR-004** | Visitors can browse upcoming and past events. | High |
| **FR-005** | Visitors can open individual event details. | High |
| **FR-006** | Visitors can view advisors and committee members. | High |
| **FR-007** | Visitors can browse gallery albums and images. | High |
| **FR-008** | Visitors can view contact information. | High |
| **FR-009** | Visitors can submit the contact form. | Medium |
| **FR-010** | Visitors can submit membership applications. | High |
| **FR-011** | Website must be fully responsive across mobile, tablet, and desktop. | High |
| **FR-012** | Website must display published content only. | High |

#### 4.2 Admin Dashboard Modules
- **Dashboard Overview:** Key statistics (total events, upcoming events, albums, members, pending applications, unread messages).
- **About Management:** Organization description, motto.
- **Mission & Vision Management:** Core statements.
- **History Management:** Milestones and timeline entries.
- **Goals Management:** 7 Organizational & 7 Research goals.
- **Event Management:** CRUD operations, publish/unpublish, image upload.
- **Leaders Management:** Manage terms, positions, member profiles.
- **Gallery Management:** Create albums, upload and order images.
- **Contact Info Management:** Official contact channels.
- **Membership Applications:** View, search, filter, approve/reject, add internal review notes.
- **Contact Messages:** Read, filter, mark as read, archive.
- **Website Settings:** Site title, meta tags, footer links.
- **Admin Users:** Manage administrator accounts subject to role permissions.

#### 4.3 Content Publishing System
Standard status workflow:
- `Draft` (hidden from public)
- `Published` (visible on public site)
- `Archived` (hidden from active listings, preserved in database)

---

### 5. User Roles and Permissions

1. **Public Visitor:** Can view published content; submit contact forms and membership applications; cannot view submissions or modify any content.
2. **Content Admin:** Can manage events, gallery, leaders, and standard content; cannot manage Super Admin accounts or alter system-wide RLS/auth settings.
3. **Super Admin:** Full administrative privileges across all modules, settings, and user management.

---

### 6. UI/UX Design System

- **Design Tone:** Professional, modern, clean, trustworthy, academic/university-oriented.
- **Color Palette:**
  - Deep Green: `#102C2B` (primary brand background, headings)
  - Gold: `#D9A441` (accent, CTA highlights, badges)
  - Off-white: `#F5F7F4` (clean backgrounds, content cards)
  - Dark Text: `#263238` (body typography, high contrast)
- **Responsive Breakpoints:** Mobile (`< 768px`), Tablet (`768px - 1024px`), Desktop (`> 1024px`).

---

### 7. Database & Storage Architecture

#### 7.1 Database Tables (PostgreSQL via Supabase)
1. `admin_profiles`
2. `site_settings`
3. `pages`
4. `goals`
5. `history_entries`
6. `events`
7. `event_images`
8. `committee_terms`
9. `committee_positions`
10. `committee_members`
11. `gallery_albums`
12. `gallery_images`
13. `achievements`
14. `publications`
15. `contact_messages`
16. `membership_applications`
17. `audit_logs`

#### 7.2 Supabase Storage Buckets
- `site-assets`: Logos, branding graphics
- `event-images`: Event banners, gallery attachments
- `leader-profiles`: Member photographs
- `gallery-images`: Photo album items
- `publications`: PDFs, public reports

---

### 8. Acceptance Criteria Summary
- All 6 navbar items in strict specified order.
- About dropdown includes all 5 sub-routes.
- 100% responsive across devices.
- Fully working CRUD in Admin Dashboard.
- RLS enforced on every PostgreSQL table.
- Zero invented organization facts published.
- Clean vanilla stack ready for Vercel deployment.
