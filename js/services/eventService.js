/**
 * NSTUANS - Event Service
 * Fetches published events and event details from Supabase PostgreSQL & Storage.
 */

(function () {
  'use strict';

  const FALLBACK_EVENTS = [
    {
      id: 'fallback-evt-1',
      title: 'Annual Campus Anti-Drug Awareness Rally',
      slug: 'campus-awareness-rally',
      short_description: 'Join fellow students and faculty members in the central rally across NSTU campus premises.',
      description: 'The Noakhali Science and Technology University Anti-Narcotics Society (NSTUANS) cordially invites all students, faculty members, researchers, and campus staff to take part in our signature awareness campaign. Our rally serves as a high-visibility, proactive demonstration of unity against substance abuse.',
      cover_image: '/assets/images/Event Opening Ceremony.jpeg',
      location: 'Central Auditorium & Campus Premises, NSTU',
      start_datetime: '2026-11-15T10:00:00+06:00',
      end_datetime: '2026-11-15T13:00:00+06:00',
      status: 'published',
      category: 'Campus Advocacy'
    },
    {
      id: 'fallback-evt-2',
      title: 'Keynote Seminar: Youth Health & Narcotics Prevention',
      slug: 'keynote-seminar-youth-health',
      short_description: 'Interactive talk with medical researchers and youth counseling experts on prevention strategies.',
      description: 'Interactive keynote address featuring healthcare experts, faculty mentors, and youth development specialists addressing pharmacological impacts and psychological resilience strategies.',
      cover_image: '/assets/images/Speaker.jpeg',
      location: 'NSTU Seminar Hall, Academic Building 2',
      start_datetime: '2026-12-02T15:00:00+06:00',
      end_datetime: '2026-12-02T17:30:00+06:00',
      status: 'published',
      category: 'Scientific Seminar'
    },
    {
      id: 'fallback-evt-3',
      title: 'Inter-Department Poster & Research Exhibition',
      slug: 'inter-department-poster-exhibition',
      short_description: 'Student poster competition showcasing creative anti-narcotics messaging and analytical posters.',
      description: 'Creative poster exhibition and presentation of youth anti-narcotics research ideas evaluating risk patterns and student health interventions.',
      cover_image: '/assets/images/Poster Presentation.jpeg',
      location: 'Academic Building 1 Concourse',
      start_datetime: '2026-12-18T11:00:00+06:00',
      end_datetime: '2026-12-18T16:00:00+06:00',
      status: 'published',
      category: 'Student Competition'
    }
  ];

  const EventService = {
    getEvents: async function (options = {}) {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        return { data: FALLBACK_EVENTS, error: null };
      }

      try {
        let query = client
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('start_datetime', { ascending: true });

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data, error } = await query;
        if (error || !data || data.length === 0) {
          return { data: FALLBACK_EVENTS, error: null };
        }
        return { data, error: null };
      } catch (err) {
        return { data: FALLBACK_EVENTS, error: null };
      }
    },

    getEventBySlug: async function (slug) {
      const client = window.NSTUANS_Config?.getClient();
      const fallback = FALLBACK_EVENTS.find(e => e.slug === slug) || FALLBACK_EVENTS[0];

      if (!client) {
        return { data: fallback, error: null };
      }

      try {
        const { data: event, error } = await client
          .from('events')
          .select('*, event_images(*)')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error || !event) {
          return { data: fallback, error: null };
        }
        return { data: event, error: null };
      } catch (err) {
        return { data: fallback, error: null };
      }
    }
  };

  window.NSTUANS_EventService = EventService;
})();
