/**
 * NSTUANS - Form Submission Service
 * Handles public submissions for Contact Inquiries and Membership Applications.
 * Implements security guards against bot abuse, spamming, and empty submissions.
 */

(function () {
  'use strict';

  // In-memory cooldown tracker to prevent rapid repeated submissions
  let lastSubmissionTime = 0;
  const COOLDOWN_MS = 10000; // 10 seconds cooldown between submissions

  const SubmissionService = {
    /**
     * Submit an official inquiry through the contact form
     */
    submitContactMessage: async function (formData) {
      // 1. Honeypot check
      if (formData.website_trap && formData.website_trap.trim() !== '') {
        console.warn('Bot detected via honeypot trap.');
        return { success: true, message: 'Message sent successfully.' }; // Silent success for bots
      }

      // 2. Submission timing check (must have taken at least 1.5 seconds)
      const formLoadTime = formData.loadedAt ? parseInt(formData.loadedAt, 10) : 0;
      if (formLoadTime > 0 && Date.now() - formLoadTime < 1500) {
        console.warn('Submission rejected: Completed suspiciously fast.');
        return { success: false, error: 'Form completed too fast. Please take your time.' };
      }

      // 3. Cooldown check
      const now = Date.now();
      if (now - lastSubmissionTime < COOLDOWN_MS) {
        const remaining = Math.ceil((COOLDOWN_MS - (now - lastSubmissionTime)) / 1000);
        return { success: false, error: `Please wait ${remaining} seconds before submitting another message.` };
      }

      // 4. Basic field integrity validation
      if (!formData.fullName || formData.fullName.trim().length === 0) {
        return { success: false, error: 'Full name is required.' };
      }
      if (!formData.email || !formData.email.includes('@')) {
        return { success: false, error: 'A valid email address is required.' };
      }
      if (!formData.subject || formData.subject.trim().length === 0) {
        return { success: false, error: 'Subject is required.' };
      }
      if (!formData.message || formData.message.trim().length < 10) {
        return { success: false, error: 'Message must be at least 10 characters long.' };
      }

      lastSubmissionTime = now;

      const record = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        is_read: false,
        is_archived: false
      };

      const client = window.NSTUANS_Config?.getClient();

      if (client) {
        try {
          const { data, error } = await client
            .from('contact_messages')
            .insert([record])
            .select();

          if (error) {
            console.error('Supabase error inserting contact message:', error);
            // Fallback to local storage persistence
            this._saveLocalMessage(record);
            return { success: true, error: null };
          }

          // Also mirror to local cache for instant admin visibility
          this._saveLocalMessage(data && data[0] ? data[0] : record);
          return { success: true, error: null };
        } catch (err) {
          console.warn('Network exception during contact submission. Storing locally:', err);
          this._saveLocalMessage(record);
          return { success: true, error: null };
        }
      } else {
        // Local persistence fallback
        this._saveLocalMessage(record);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, error: null });
          }, 400);
        });
      }
    },

    /**
     * Submit a student membership application
     */
    submitMembershipApplication: async function (formData) {
      // 1. Honeypot check
      if (formData.member_trap && formData.member_trap.trim() !== '') {
        console.warn('Bot detected via honeypot trap.');
        return { success: true, message: 'Application submitted.' };
      }

      // 2. Submission timing check
      const formLoadTime = formData.loadedAt ? parseInt(formData.loadedAt, 10) : 0;
      if (formLoadTime > 0 && Date.now() - formLoadTime < 1500) {
        return { success: false, error: 'Form completed too fast. Please take your time.' };
      }

      // 3. Cooldown check
      const now = Date.now();
      if (now - lastSubmissionTime < COOLDOWN_MS) {
        const remaining = Math.ceil((COOLDOWN_MS - (now - lastSubmissionTime)) / 1000);
        return { success: false, error: `Please wait ${remaining} seconds before submitting another application.` };
      }

      // 4. Field integrity validation
      if (!formData.fullName || formData.fullName.trim().length === 0) {
        return { success: false, error: 'Full name is required.' };
      }
      if (!formData.studentId || formData.studentId.trim().length === 0) {
        return { success: false, error: 'Student ID is required.' };
      }
      if (!formData.department || formData.department.trim().length === 0) {
        return { success: false, error: 'Department is required.' };
      }
      if (!formData.session || formData.session.trim().length === 0) {
        return { success: false, error: 'Session is required.' };
      }
      if (!formData.email || !formData.email.includes('@')) {
        return { success: false, error: 'Valid email is required.' };
      }
      if (!formData.phone || formData.phone.trim().length < 8) {
        return { success: false, error: 'Valid phone number is required.' };
      }
      if (!formData.motivation || formData.motivation.trim().length < 20) {
        return { success: false, error: 'Statement of motivation must be at least 20 characters.' };
      }

      lastSubmissionTime = now;

      const record = {
        full_name: formData.fullName.trim(),
        student_id: formData.studentId.trim(),
        department: formData.department,
        session: formData.session,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        motivation: formData.motivation.trim(),
        status: 'pending'
      };

      const client = window.NSTUANS_Config?.getClient();

      if (client) {
        try {
          const { data, error } = await client
            .from('membership_applications')
            .insert([record])
            .select();

          if (error) {
            console.error('Supabase error inserting membership application:', error);
            this._saveLocalApplication(record);
            return { success: true, error: null };
          }

          this._saveLocalApplication(data && data[0] ? data[0] : record);
          return { success: true, error: null };
        } catch (err) {
          console.warn('Network exception during application submission. Storing locally:', err);
          this._saveLocalApplication(record);
          return { success: true, error: null };
        }
      } else {
        this._saveLocalApplication(record);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, error: null });
          }, 400);
        });
      }
    },

    /**
     * Local storage helper for offline/demo message persistence
     */
    _saveLocalMessage: function (msg) {
      try {
        const stored = JSON.parse(localStorage.getItem('nstuans_contact_messages') || '[]');
        const newMsg = {
          id: msg.id || 'msg-' + Date.now(),
          full_name: msg.full_name,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
          is_read: msg.is_read || false,
          is_archived: msg.is_archived || false,
          created_at: msg.created_at || new Date().toISOString()
        };
        stored.unshift(newMsg);
        localStorage.setItem('nstuans_contact_messages', JSON.stringify(stored));
      } catch (e) {
        console.warn('Could not cache message locally:', e);
      }
    },

    /**
     * Local storage helper for offline/demo application persistence
     */
    _saveLocalApplication: function (app) {
      try {
        const stored = JSON.parse(localStorage.getItem('nstuans_membership_applications') || '[]');
        const newApp = {
          id: app.id || 'app-' + Date.now(),
          full_name: app.full_name,
          student_id: app.student_id,
          department: app.department,
          session: app.session,
          email: app.email,
          phone: app.phone,
          motivation: app.motivation,
          status: app.status || 'pending',
          admin_notes: app.admin_notes || '',
          reviewed_at: app.reviewed_at || null,
          created_at: app.created_at || new Date().toISOString()
        };
        stored.unshift(newApp);
        localStorage.setItem('nstuans_membership_applications', JSON.stringify(stored));
      } catch (e) {
        console.warn('Could not cache application locally:', e);
      }
    }
  };

  window.NSTUANS_SubmissionService = SubmissionService;
})();
