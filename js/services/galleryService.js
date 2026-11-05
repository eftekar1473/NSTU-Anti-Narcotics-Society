/**
 * NSTUANS - Photo Gallery Service
 * Fetches published albums and image collections from PostgreSQL and Supabase Storage.
 */

(function () {
  'use strict';

  const FALLBACK_ALBUMS = [
    {
      id: 'album-1',
      title: 'NSTUANS Opening Ceremony & Inauguration',
      slug: 'opening-ceremony',
      description: 'Photographic moments from the foundational launching event uniting faculty advisors, university dignitaries, and student organizers.',
      cover_image: '/assets/images/Event Opening Ceremony.jpeg',
      event_date: '2026-01-15',
      status: 'published',
      images: [
        { image_url: '/assets/images/Event Opening Ceremony.jpeg', caption: 'Opening Ceremony Main Stage & Dignitaries' },
        { image_url: '/assets/images/Speaker.jpeg', caption: 'Keynote Address on Campus Substance Abuse Prevention' },
        { image_url: '/assets/images/club logo.jpg', caption: 'Official NSTUANS Emblem and Banner' }
      ]
    },
    {
      id: 'album-2',
      title: 'Campus Poster Presentation & Awareness Art',
      slug: 'poster-presentation',
      description: 'Creative infographic posters and visual presentations produced by students illustrating the health and psychological costs of drug addiction.',
      cover_image: '/assets/images/Poster Presentation.jpeg',
      event_date: '2026-02-10',
      status: 'published',
      images: [
        { image_url: '/assets/images/Poster Presentation.jpeg', caption: 'Inter-Department Poster Session on Substance Abuse' },
        { image_url: '/assets/images/Research Idea Presentation.jpeg', caption: 'Student Explaining Evidence-Based Prevention Poster' },
        { image_url: '/assets/images/Speaker.jpeg', caption: 'Judges and Advisors Reviewing Poster Presentations' }
      ]
    },
    {
      id: 'album-3',
      title: 'Student Research Idea Forum & Discussions',
      slug: 'research-idea-presentation',
      description: 'Young scholars sharing empirical research methodologies to study substance trends, socio-economic factors, and preventive public health policies.',
      cover_image: '/assets/images/Research Idea Presentation.jpeg',
      event_date: '2026-03-05',
      status: 'published',
      images: [
        { image_url: '/assets/images/Research Idea Presentation.jpeg', caption: 'Research Idea Presentation to Faculty Panel' },
        { image_url: '/assets/images/Poster Presentation.jpeg', caption: 'Analytical Charts on Drug Prevention Strategies' },
        { image_url: '/assets/images/Event Opening Ceremony.jpeg', caption: 'Academic Collaboration Discussion Session' }
      ]
    },
    {
      id: 'album-4',
      title: 'Keynote Addresses & Expert Dialogues',
      slug: 'speaker-sessions',
      description: 'Engaging speeches and scientific guidance delivered by faculty mentors, visiting doctors, and counseling specialists.',
      cover_image: '/assets/images/Speaker.jpeg',
      event_date: '2026-04-12',
      status: 'published',
      images: [
        { image_url: '/assets/images/Speaker.jpeg', caption: 'Specialist Speaker Delivering Anti-Narcotics Lecture' },
        { image_url: '/assets/images/Event Opening Ceremony.jpeg', caption: 'Auditorium Audience of Students and Faculty' },
        { image_url: '/assets/images/club logo.jpg', caption: 'NSTU Anti-Narcotics Society Crest' }
      ]
    }
  ];

  const GalleryService = {
    getAlbums: async function () {
      const client = window.NSTUANS_Config?.getClient();
      if (!client) {
        return { data: FALLBACK_ALBUMS, error: null };
      }

      try {
        const { data, error } = await client
          .from('gallery_albums')
          .select('*')
          .eq('status', 'published')
          .order('event_date', { ascending: false });

        if (error || !data || data.length === 0) {
          return { data: FALLBACK_ALBUMS, error: null };
        }
        return { data, error: null };
      } catch (err) {
        return { data: FALLBACK_ALBUMS, error: null };
      }
    },

    getAlbumBySlug: async function (slug) {
      const client = window.NSTUANS_Config?.getClient();
      const fallback = FALLBACK_ALBUMS.find(a => a.slug === slug) || FALLBACK_ALBUMS[0];

      if (!client) {
        return { data: fallback, error: null };
      }

      try {
        const { data, error } = await client
          .from('gallery_albums')
          .select('*, gallery_images(*)')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error || !data) {
          return { data: fallback, error: null };
        }
        return { data, error: null };
      } catch (err) {
        return { data: fallback, error: null };
      }
    }
  };

  window.NSTUANS_GalleryService = GalleryService;
})();
