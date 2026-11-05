/**
 * NSTUANS - Form Submission Service
 * Handles secure public insertions for Contact Inquiries and Membership Applications.
 */

(function () {
  'use strict';

  const SubmissionService = {
    /**
     * Submit an official inquiry through the contact form
     */
    submitContactMessage: async function (formData) {
      // Honeypot check
      if (formData.website_trap && formData.website_trap.trim() !== '') {
        console.warn('Bot detected via honeypot.');
        return { success: true, message: 'Message submitted.' }; // Silent success for bots
      }

      const client = window.NSTUANS_Config?.getClient();

      if (!client) {
        // Fallback simulated success
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, error: null });
          }, 600);
        });
      }

      try {
        const { error } = await client
          .from('contact_messages')
          .insert([
            {
              full_name: formData.fullName.trim(),
              email: formData.email.trim(),
              subject: formData.subject.trim(),
              message: formData.message.trim(),
              is_read: false,
              is_archived: false
            }
          ]);

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message || 'Submission failed.' };
      }
    },

    /**
     * Submit a student membership application
     */
    submitMembershipApplication: async function (formData) {
      // Honeypot check
      if (formData.member_trap && formData.member_trap.trim() !== '') {
        console.warn('Bot detected via honeypot.');
        return { success: true, message: 'Application submitted.' };
      }

      const client = window.NSTUANS_Config?.getClient();

      if (!client) {
        // Fallback simulated success
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, error: null });
          }, 600);
        });
      }

      try {
        const { error } = await client
          .from('membership_applications')
          .insert([
            {
              full_name: formData.fullName.trim(),
              student_id: formData.studentId.trim(),
              department: formData.department,
              session: formData.session,
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              motivation: formData.motivation.trim(),
              status: 'pending'
            }
          ]);

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message || 'Submission failed.' };
      }
    }
  };

  window.NSTUANS_SubmissionService = SubmissionService;
})();
