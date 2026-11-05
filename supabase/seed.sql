-- ==============================================================================
-- NSTUANS Seed Data
-- Database: PostgreSQL 14+ (Supabase)
-- Strict Integrity: Only verified information from the SRS and Details PDF
-- ==============================================================================

-- 1. Site Settings
INSERT INTO site_settings (
    site_name,
    site_short_name,
    motto,
    logo_url,
    office_address
) VALUES (
    'Noakhali Science and Technology University Anti-Narcotics Society',
    'NSTUANS',
    'Say No to Drugs, Say Yes to Life.',
    '/assets/images/club logo.jpg',
    'Noakhali Science and Technology University (NSTU), Sonapur, Noakhali-3814, Bangladesh'
);

-- 2. Core Pages Content
INSERT INTO pages (slug, title, subtitle, content, meta_description, status) VALUES
(
    'about',
    'About NSTUANS',
    'Student-Led Anti-Narcotics Society at NSTU',
    'The Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS) is a student-led organization committed to building a drug-free, aware, and socially responsible university community. The society aims to raise awareness about the harmful effects of narcotics and substance abuse while encouraging students to make informed and responsible choices. Through awareness campaigns, educational seminars, workshops, research initiatives, and community engagement, NSTUANS seeks to promote a healthy lifestyle and strengthen the role of young people in preventing drug abuse. We believe that a drug-free society begins with awareness, education, responsibility, and collective action. Our mission goes beyond the university campus, aspiring to contribute to a safer, healthier, and more conscious society.',
    'Official background and overview of Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS).',
    'published'
),
(
    'mission',
    'Our Mission',
    'Proposed Mission Statement (Pending Formal Ratification)',
    'To raise awareness about narcotics and substance abuse through education, research, awareness campaigns, and community engagement while encouraging students to make responsible choices.',
    'Mission statement of NSTU Anti-Narcotics Society (NSTUANS).',
    'published'
),
(
    'vision',
    'Our Vision',
    'Proposed Vision Statement (Pending Formal Ratification)',
    'To build a drug-free, aware, healthy, and socially responsible university community and contribute to a safer society.',
    'Vision statement of NSTU Anti-Narcotics Society (NSTUANS).',
    'published'
);

-- 3. Seven Organizational Goals
INSERT INTO goals (goal_type, goal_number, title, description, display_order, is_active) VALUES
(
    'organizational',
    1,
    'A Drug-Free Campus',
    'Promote a safe, healthy, and drug-free environment within the university.',
    1,
    true
),
(
    'organizational',
    2,
    'Raising Awareness',
    'Educate students about the physical, psychological, social, and economic consequences of drug abuse.',
    2,
    true
),
(
    'organizational',
    3,
    'Empowering Youth',
    'Encourage students to become responsible leaders and advocates of anti-narcotics initiatives.',
    3,
    true
),
(
    'organizational',
    4,
    'Promoting Healthy Lifestyles',
    'Inspire young people to engage in positive activities, sports, education, and creative pursuits.',
    4,
    true
),
(
    'organizational',
    5,
    'Strengthening Community Engagement',
    'Extend awareness initiatives beyond the campus and work with local communities.',
    5,
    true
),
(
    'organizational',
    6,
    'Encouraging Research and Innovation',
    'Promote evidence-based understanding of drug addiction, its causes, consequences, and prevention strategies.',
    6,
    true
),
(
    'organizational',
    7,
    'Building Partnerships',
    'Collaborate with educational institutions, government organizations, NGOs, and other relevant stakeholders.',
    7,
    true
);

-- 4. Seven Research Goals
INSERT INTO goals (goal_type, goal_number, title, description, display_order, is_active) VALUES
(
    'research',
    1,
    'Understand Drug Abuse Patterns',
    'Explore the prevalence, trends, and patterns of substance use among young people.',
    1,
    true
),
(
    'research',
    2,
    'Identify Risk Factors',
    'Investigate the social, economic, psychological, and environmental factors associated with drug abuse.',
    2,
    true
),
(
    'research',
    3,
    'Assess Social Impacts',
    'Examine how substance abuse affects individuals, families, educational institutions, and communities.',
    3,
    true
),
(
    'research',
    4,
    'Evaluate Awareness and Attitudes',
    'Study students'' knowledge, perceptions, and attitudes toward narcotics and substance abuse.',
    4,
    true
),
(
    'research',
    5,
    'Explore Prevention Strategies',
    'Identify effective approaches to drug prevention, awareness, and rehabilitation.',
    5,
    true
),
(
    'research',
    6,
    'Promote Evidence-Based Solutions',
    'Conduct surveys, field studies, and research activities to support informed decision-making and policy recommendations.',
    6,
    true
),
(
    'research',
    7,
    'Encourage Academic Collaboration',
    'Create opportunities for students and researchers to work together on drug-related social issues.',
    7,
    true
);

-- 5. Standard Configurable Committee Positions
INSERT INTO committee_positions (title, category, rank_order) VALUES
('Chief Patron & Advisor', 'advisory', 1),
('Faculty Advisor', 'advisory', 2),
('Counseling Advisor', 'advisory', 3),
('President', 'executive', 4),
('Vice President', 'executive', 5),
('General Secretary', 'executive', 6),
('Joint Secretary', 'executive', 7),
('Organizing Secretary', 'executive', 8),
('Research & Publication Secretary', 'executive', 9),
('Treasurer', 'executive', 10),
('Executive Member', 'executive', 11);

-- 6. Committee Terms
INSERT INTO committee_terms (term_name, start_year, end_year, is_current) VALUES
('2025-2026', 2025, 2026, true);

-- 7. Verified Gallery Albums
INSERT INTO gallery_albums (title, slug, description, cover_image, status) VALUES
(
    'NSTUANS Opening Ceremony & Inauguration',
    'opening-ceremony',
    'Photographic moments from the foundational launching event uniting faculty advisors, university dignitaries, and student organizers.',
    '/assets/images/Event Opening Ceremony.jpeg',
    'published'
),
(
    'Campus Poster Presentation & Awareness Art',
    'poster-presentation',
    'Creative infographic posters and visual presentations produced by students illustrating the health and psychological costs of drug addiction.',
    '/assets/images/Poster Presentation.jpeg',
    'published'
),
(
    'Student Research Idea Forum & Discussions',
    'research-idea-presentation',
    'Young scholars sharing empirical research methodologies to study substance trends, socio-economic factors, and preventive public health policies.',
    '/assets/images/Research Idea Presentation.jpeg',
    'published'
),
(
    'Keynote Addresses & Expert Dialogues',
    'speaker-sessions',
    'Engaging speeches and scientific guidance delivered by faculty mentors, visiting doctors, and counseling specialists.',
    '/assets/images/Speaker.jpeg',
    'published'
);

-- 8. Verified Events
INSERT INTO events (title, slug, short_description, description, cover_image, location, start_datetime, status, published_at) VALUES
(
    'Annual Campus Anti-Drug Awareness Rally',
    'campus-awareness-rally',
    'Join fellow students and faculty members in the central rally across NSTU campus premises.',
    'The Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS) cordially invites all students, faculty members, researchers, and campus staff to take part in our signature awareness campaign. Our rally serves as a high-visibility, proactive demonstration of unity against substance abuse, emphasizing peer solidarity, mental health resources, and the irreplaceable value of living a healthy, drug-free life.',
    '/assets/images/Event Opening Ceremony.jpeg',
    'Central Auditorium & Campus Premises, NSTU',
    '2026-11-15 10:00:00+06',
    'published',
    NOW()
),
(
    'Keynote Seminar: Youth Health & Narcotics Prevention',
    'keynote-seminar-youth-health',
    'Interactive talk with medical researchers and youth counseling experts on prevention strategies.',
    'Interactive keynote address featuring healthcare experts, faculty mentors, and youth development specialists addressing pharmacological impacts and psychological resilience strategies.',
    '/assets/images/Speaker.jpeg',
    'NSTU Seminar Hall, Academic Building 2',
    '2026-12-02 15:00:00+06',
    'published',
    NOW()
),
(
    'Inter-Department Poster & Research Exhibition',
    'inter-department-poster-exhibition',
    'Student poster competition showcasing creative anti-narcotics messaging and analytical posters.',
    'Creative poster exhibition and presentation of youth anti-narcotics research ideas evaluating risk patterns and student health interventions.',
    '/assets/images/Poster Presentation.jpeg',
    'Academic Building 1 Concourse',
    '2026-12-18 11:00:00+06',
    'published',
    NOW()
);
