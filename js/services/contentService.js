/**
 * NSTUANS - Content Service
 * Manages dynamic pages (About, Mission, Vision), Goals, History Milestones, and Site Settings.
 */

(function () {
  'use strict';

  // Verified Fallback Seed Data (used when Supabase client is not connected)
  const FALLBACK_PAGES = {
    'about': {
      title: 'About NSTUANS',
      subtitle: 'Student-Led Anti-Narcotics Society at NSTU',
      content: 'The Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS) is a student-led organization committed to building a drug-free, aware, and socially responsible university community. The society aims to raise awareness about the harmful effects of narcotics and substance abuse while encouraging students to make informed and responsible choices. Through awareness campaigns, educational seminars, workshops, research initiatives, and community engagement, NSTUANS seeks to promote a healthy lifestyle and strengthen the role of young people in preventing drug abuse. We believe that a drug-free society begins with awareness, education, responsibility, and collective action. Our mission goes beyond the university campus, aspiring to contribute to a safer, healthier, and more conscious society.'
    },
    'mission': {
      title: 'Our Mission',
      subtitle: 'Proposed Mission Statement (Pending Formal Ratification)',
      content: 'To raise awareness about narcotics and substance abuse through education, research, awareness campaigns, and community engagement while encouraging students to make responsible choices.'
    },
    'vision': {
      title: 'Our Vision',
      subtitle: 'Proposed Vision Statement (Pending Formal Ratification)',
      content: 'To build a drug-free, aware, healthy, and socially responsible university community and contribute to a safer society.'
    }
  };

  const FALLBACK_GOALS = [
    { goal_type: 'organizational', goal_number: 1, title: 'A Drug-Free Campus', description: 'Promote a safe, healthy, and drug-free environment within the university.' },
    { goal_type: 'organizational', goal_number: 2, title: 'Raising Awareness', description: 'Educate students about the physical, psychological, social, and economic consequences of drug abuse.' },
    { goal_type: 'organizational', goal_number: 3, title: 'Empowering Youth', description: 'Encourage students to become responsible leaders and advocates of anti-narcotics initiatives.' },
    { goal_type: 'organizational', goal_number: 4, title: 'Promoting Healthy Lifestyles', description: 'Inspire young people to engage in positive activities, sports, education, and creative pursuits.' },
    { goal_type: 'organizational', goal_number: 5, title: 'Strengthening Community Engagement', description: 'Extend awareness initiatives beyond the campus and work with local communities.' },
    { goal_type: 'organizational', goal_number: 6, title: 'Encouraging Research and Innovation', description: 'Promote evidence-based understanding of drug addiction, its causes, consequences, and prevention strategies.' },
    { goal_type: 'organizational', goal_number: 7, title: 'Building Partnerships', description: 'Collaborate with educational institutions, government organizations, NGOs, and other relevant stakeholders.' },
    { goal_type: 'research', goal_number: 1, title: 'Understand Drug Abuse Patterns', description: 'Explore the prevalence, trends, and patterns of substance use among young people.' },
    { goal_type: 'research', goal_number: 2, title: 'Identify Risk Factors', description: 'Investigate the social, economic, psychological, and environmental factors associated with drug abuse.' },
    { goal_type: 'research', goal_number: 3, title: 'Assess Social Impacts', description: 'Examine how substance abuse affects individuals, families, educational institutions, and communities.' },
    { goal_type: 'research', goal_number: 4, title: 'Evaluate Awareness and Attitudes', description: 'Study students\' knowledge, perceptions, and attitudes toward narcotics and substance abuse.' },
    { goal_type: 'research', goal_number: 5, title: 'Explore Prevention Strategies', description: 'Identify effective approaches to drug prevention, awareness, and rehabilitation.' },
    { goal_type: 'research', goal_number: 6, title: 'Promote Evidence-Based Solutions', description: 'Conduct surveys, field studies, and research activities to support informed decision-making and policy recommendations.' },
    { goal_type: 'research', goal_number: 7, title: 'Encourage Academic Collaboration', description: 'Create opportunities for students and researchers to work together on drug-related social issues.' }
  ];

  const ContentService = {
    getPage: async function (slug) {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        return { data: FALLBACK_PAGES[slug] || null, error: null };
      }

      try {
        const { data, error } = await client
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) {
          console.warn('Using fallback page content for:', slug);
          return { data: FALLBACK_PAGES[slug] || null, error: null };
        }
        return { data, error: null };
      } catch (err) {
        return { data: FALLBACK_PAGES[slug] || null, error: null };
      }
    },

    getGoals: async function (type = null) {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        const filtered = type ? FALLBACK_GOALS.filter(g => g.goal_type === type) : FALLBACK_GOALS;
        return { data: filtered, error: null };
      }

      try {
        let query = client
          .from('goals')
          .select('*')
          .eq('is_active', true)
          .order('goal_number', { ascending: true });

        if (type) {
          query = query.eq('goal_type', type);
        }

        const { data, error } = await query;
        if (error || !data || data.length === 0) {
          const filtered = type ? FALLBACK_GOALS.filter(g => g.goal_type === type) : FALLBACK_GOALS;
          return { data: filtered, error: null };
        }
        return { data, error: null };
      } catch (err) {
        const filtered = type ? FALLBACK_GOALS.filter(g => g.goal_type === type) : FALLBACK_GOALS;
        return { data: filtered, error: null };
      }
    },

    getSiteSettings: async function () {
      const client = window.NSTUANS_Config?.getClient();
      const defaultSettings = {
        site_name: 'Noakhali Science and Technology University Anti-Narcotics Society',
        site_short_name: 'NSTUANS',
        motto: 'Say No to Drugs, Say Yes to Life.',
        office_address: 'Noakhali Science and Technology University, Sonapur, Noakhali-3814',
        logo_url: '/assets/images/club logo.jpg'
      };

      if (!client) return { data: defaultSettings, error: null };

      try {
        const { data, error } = await client
          .from('site_settings')
          .select('*')
          .limit(1)
          .single();

        return { data: data || defaultSettings, error: null };
      } catch (err) {
        return { data: defaultSettings, error: null };
      }
    }
  };

  window.NSTUANS_ContentService = ContentService;
})();
