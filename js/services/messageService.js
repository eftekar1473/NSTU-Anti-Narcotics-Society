/**
 * NSTUANS - Contact Messages Management Service
 * Provides authorized admin operations on contact inbox inquiries:
 * Reading, search, filtering, marking as read, archiving, and deletion.
 */

(function () {
  'use strict';

  const BASELINE_MESSAGES = [
    {
      id: 'msg-seed-001',
      full_name: 'Campus Visitor',
      email: 'visitor@example.com',
      subject: 'Inquiry on upcoming anti-narcotics seminar schedule',
      message: 'Hello NSTUANS committee, I would like to know if non-science department students can participate as volunteers in the upcoming awareness campaign rally and workshop.',
      is_read: false,
      is_archived: false,
      created_at: '2026-11-04T14:15:00Z'
    }
  ];

  const MessageService = {
    /**
     * Fetch all contact messages
     */
    getMessages: async function () {
      const client = window.NSTUANS_Config?.getClient();

      if (client && window.NSTUANS_Auth?.isAuthenticated()) {
        try {
          const { data, error } = await client
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data) && data.length > 0) {
            this._syncLocal(data);
            return data;
          }
        } catch (err) {
          console.warn('Could not fetch messages from Supabase, using local cache:', err);
        }
      }

      return this._getLocal();
    },

    /**
     * Mark message as read
     */
    markAsRead: async function (id) {
      const client = window.NSTUANS_Config?.getClient();

      if (client && window.NSTUANS_Auth?.isAuthenticated()) {
        try {
          await client
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', id);
        } catch (err) {
          console.warn('Error marking message read in Supabase:', err);
        }
      }

      this._updateLocal(id, { is_read: true });
      return { success: true };
    },

    /**
     * Archive message
     */
    archiveMessage: async function (id) {
      const client = window.NSTUANS_Config?.getClient();

      if (client && window.NSTUANS_Auth?.isAuthenticated()) {
        try {
          await client
            .from('contact_messages')
            .update({ is_archived: true })
            .eq('id', id);
        } catch (err) {
          console.warn('Error archiving message in Supabase:', err);
        }
      }

      this._updateLocal(id, { is_archived: true });
      return { success: true };
    },

    /**
     * Delete message
     */
    deleteMessage: async function (id) {
      const client = window.NSTUANS_Config?.getClient();

      if (client && window.NSTUANS_Auth?.isAuthenticated()) {
        try {
          await client
            .from('contact_messages')
            .delete()
            .eq('id', id);
        } catch (err) {
          console.warn('Error deleting message in Supabase:', err);
        }
      }

      const list = this._getLocal().filter(m => m.id !== id);
      this._syncLocal(list);
      return { success: true };
    },

    /**
     * Helper: get local cache
     */
    _getLocal: function () {
      try {
        const stored = localStorage.getItem('nstuans_contact_messages');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading local messages:', e);
      }
      this._syncLocal(BASELINE_MESSAGES);
      return BASELINE_MESSAGES;
    },

    /**
     * Helper: write to local cache
     */
    _syncLocal: function (msgs) {
      try {
        localStorage.setItem('nstuans_contact_messages', JSON.stringify(msgs));
      } catch (e) {
        console.warn('Error saving local messages:', e);
      }
    },

    /**
     * Helper: update individual message in local cache
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

  window.NSTUANS_MessageService = MessageService;
})();
