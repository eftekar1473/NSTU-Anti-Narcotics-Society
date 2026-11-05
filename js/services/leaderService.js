/**
 * NSTUANS - Leadership & Committee Service
 * Fetches verified advisors, committee terms, and executive officers.
 */

(function () {
  'use strict';

  const FALLBACK_ADVISORS = [
    {
      id: 'adv-1',
      full_name: 'Advisory Board Member',
      role: 'Chief Patron & Advisor',
      department: 'Faculty of Science, NSTU',
      biography: 'Providing strategic direction, public health insights, and mentorship to society leaders.',
      profile_image: '/assets/images/Speaker.jpeg',
      is_verified: true
    },
    {
      id: 'adv-2',
      full_name: 'Faculty Advisor',
      role: 'Academic Mentor',
      department: 'Department of Pharmacy / Science',
      biography: 'Assisting with pharmaceutical evidence, research ethics, and student welfare.',
      profile_image: null,
      is_verified: false
    },
    {
      id: 'adv-3',
      full_name: 'Counseling Advisor',
      role: 'Youth Counselor',
      department: 'Student Counseling & Guidance Center',
      biography: 'Guiding psychological intervention models and peer counseling programs.',
      profile_image: null,
      is_verified: false
    }
  ];

  const LeaderService = {
    getAdvisors: async function () {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        return { data: FALLBACK_ADVISORS, error: null };
      }

      try {
        const { data, error } = await client
          .from('committee_members')
          .select('*, committee_positions(*), committee_terms(*)')
          .eq('is_active', true)
          .eq('is_verified', true)
          .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) {
          return { data: FALLBACK_ADVISORS, error: null };
        }
        return { data, error: null };
      } catch (err) {
        return { data: FALLBACK_ADVISORS, error: null };
      }
    },

    getCurrentTerm: async function () {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        return { data: { term_name: '2025-2026', is_current: true }, error: null };
      }

      try {
        const { data, error } = await client
          .from('committee_terms')
          .select('*')
          .eq('is_current', true)
          .single();

        return { data: data || { term_name: '2025-2026' }, error: null };
      } catch (err) {
        return { data: { term_name: '2025-2026' }, error: null };
      }
    }
  };

  window.NSTUANS_LeaderService = LeaderService;
})();
