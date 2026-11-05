/**
 * NSTUANS - Application Management Service
 * Provides authorized admin operations on student membership applications:
 * Retrieval, status filtering, search, review notes, approval, and rejection.
 */

(function () {
  'use strict';

  const BASELINE_APPLICATIONS = [
    {
      id: 'app-seed-001',
      full_name: 'Tanvir Ahmed',
      student_id: 'ASH2101001M',
      department: 'CSTE',
      session: '2021-2022',
      email: 'tanvir@student.nstu.edu.bd',
      phone: '01711000000',
      motivation: 'I want to actively contribute to building a drug-free, conscious university environment through peer advocacy and campus campaign organizing.',
      status: 'pending',
      admin_notes: '',
      reviewed_by: null,
      reviewed_at: null,
      created_at: '2026-11-04T10:30:00Z'
    }
  ];

  const ApplicationService = {
    /**
     * Fetch all membership applications with fallback to local cache
     */
    getApplications: async function () {
      const client = window.NSTUANS_Config?.getClient();

      if (client && window.NSTUANS_Auth?.isAuthenticated()) {
        try {
          const { data, error } = await client
            .from('membership_applications')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data) && data.length > 0) {
            this._syncLocal(data);
            return data;
          }
        } catch (err) {
          console.warn('Could not fetch applications from Supabase, using local cache:', err);
        }
      }

      return this._getLocal();
    },

    /**
     * Get single application by ID
     */
    getApplicationById: async function (id) {
      const all = await this.getApplications();
      return all.find(app => app.id === id) || null;
    },

    /**
     * Update application status (approve or reject) and record admin notes
     */
    updateStatus: async function (id, newStatus, adminNotes) {
      if (!['pending', 'approved', 'rejected'].includes(newStatus)) {
        return { success: false, error: 'Invalid status' };
      }

      const client = window.NSTUANS_Config?.getClient();
      const currentUser = window.NSTUANS_Auth?.getUser();
      const reviewedAt = new Date().toISOString();

      const updatePayload = {
        status: newStatus,
        admin_notes: adminNotes || '',
        reviewed_at: reviewedAt
      };

      if (currentUser && currentUser.id) {
        updatePayload.reviewed_by = currentUser.id;
      }

      let dbSuccess = false;

      if (client && window.NSTUANS_Auth?.isAuthenticated()) {
        try {
          const { error } = await client
            .from('membership_applications')
            .update(updatePayload)
            .eq('id', id);

          if (!error) {
            dbSuccess = true;
          } else {
            console.warn('Supabase application update returned error, saving locally:', error);
          }
        } catch (err) {
          console.warn('Network exception during application update:', err);
        }
      }

      // Always update local cache for smooth UI response
      this._updateLocal(id, updatePayload);
      return { success: true, dbSuccess: dbSuccess };
    },

    /**
     * Helper: retrieve local cache or baseline
     */
    _getLocal: function () {
      try {
        const stored = localStorage.getItem('nstuans_membership_applications');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading local applications:', e);
      }
      this._syncLocal(BASELINE_APPLICATIONS);
      return BASELINE_APPLICATIONS;
    },

    /**
     * Helper: write to local cache
     */
    _syncLocal: function (apps) {
      try {
        localStorage.setItem('nstuans_membership_applications', JSON.stringify(apps));
      } catch (e) {
        console.warn('Error writing local applications:', e);
      }
    },

    /**
     * Helper: update individual application in local cache
     */
    _updateLocal: function (id, updates) {
      const list = this._getLocal();
      const updated = list.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      });
      this._syncLocal(updated);
    }
  };

  window.NSTUANS_ApplicationService = ApplicationService;
})();
