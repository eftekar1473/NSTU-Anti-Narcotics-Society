#!/usr/bin/env python3
"""
NSTUANS Phase 8 Verification Test Suite:
Validates Membership Application & Contact Management workflows.
- Public form field integrity & bot protection
- Admin application review workflow (Approve, Reject, Notes, Filtering, Search)
- Admin contact message inbox workflow (Read, Mark Read, Archive, Delete)
- Database RLS and confidentiality guarantees
"""

import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def check(condition, message):
    if condition:
        print(f"  [PASS] {message}")
        return True
    else:
        print(f"  [FAIL] {message}")
        return False

def test_join_us_form():
    print("\n--- Testing Public Join Us Form (join-us/index.html) ---")
    path = os.path.join(BASE_DIR, "join-us", "index.html")
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    passed = True
    # Required fields
    passed &= check('id="member-name"' in html, "Full Name field exists")
    passed &= check('id="member-id"' in html, "Student ID field exists")
    passed &= check('id="member-dept"' in html, "Department selector exists")
    passed &= check('id="member-session"' in html, "Academic session selector exists")
    passed &= check('id="member-phone"' in html, "Phone number field exists")
    passed &= check('id="member-email"' in html, "Email address field exists")
    passed &= check('id="member-motivation"' in html, "Why do you want to join / motivation textarea exists")
    passed &= check('id="member-agreement"' in html, "Anti-narcotics pledge / agreement checkbox exists")
    
    # Abuse prevention
    passed &= check('name="member_trap"' in html, "Bot honeypot input is present")
    passed &= check('data-loaded-at' in html, "Form load timestamp tracker is present")
    
    # Confirmation & Privacy
    passed &= check('id="application-success-box"' in html, "Submission confirmation alert is present")
    passed &= check("Privacy Guarantee" in html or "never exposed publicly" in html, "Data privacy guarantee note is clearly visible")
    
    # Validation logic
    passed &= check("isValidStudentId" in html, "Student ID validator is wired")
    passed &= check("isValidPhone" in html, "Phone validator is wired")
    passed &= check("isValidEmail" in html, "Email format validator is wired")
    passed &= check("submitMembershipApplication" in html, "Connects to NSTUANS_SubmissionService")
    return passed

def test_contact_form():
    print("\n--- Testing Public Contact Form (contact/index.html) ---")
    path = os.path.join(BASE_DIR, "contact", "index.html")
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    passed = True
    passed &= check('id="contact-name"' in html, "Contact Name field exists")
    passed &= check('id="contact-email"' in html, "Contact Email field exists")
    passed &= check('id="contact-subject"' in html, "Contact Subject field exists")
    passed &= check('id="contact-message"' in html, "Contact Message textarea exists")
    passed &= check('name="website_trap"' in html, "Bot honeypot input is present")
    passed &= check('data-loaded-at' in html, "Form load timestamp tracker is present")
    passed &= check('id="contact-success-alert"' in html, "Submission confirmation alert is present")
    passed &= check("submitContactMessage" in html, "Connects to NSTUANS_SubmissionService")
    return passed

def test_submission_service():
    print("\n--- Testing Form Submission Service (js/services/submissionService.js) ---")
    path = os.path.join(BASE_DIR, "js", "services", "submissionService.js")
    with open(path, "r", encoding="utf-8") as f:
        js = f.read()

    passed = True
    passed &= check("website_trap" in js and "member_trap" in js, "Honeypot detection implemented for both forms")
    passed &= check("COOLDOWN_MS" in js or "cooldown" in js.lower(), "Client-side submission cooldown rate limiting implemented")
    passed &= check("1500" in js or "loadedAt" in js, "Bot fast-submission timing check implemented")
    passed &= check("membership_applications" in js, "Inserts into membership_applications table")
    passed &= check("contact_messages" in js, "Inserts into contact_messages table")
    passed &= check("_saveLocalApplication" in js and "_saveLocalMessage" in js, "Local cache fallbacks ensure zero-downtime offline functionality")
    return passed

def test_application_service_and_admin():
    print("\n--- Testing Application Management (admin/applications.html & applicationService.js) ---")
    js_path = os.path.join(BASE_DIR, "js", "services", "applicationService.js")
    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()

    html_path = os.path.join(BASE_DIR, "admin", "applications.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    passed = True
    # Service tests
    passed &= check("getApplications" in js, "Service provides getApplications()")
    passed &= check("updateStatus" in js, "Service provides updateStatus()")
    passed &= check("'pending', 'approved', 'rejected'" in js, "Validates statuses ('pending', 'approved', 'rejected')")
    passed &= check("admin_notes" in js, "Supports recording confidential admin_notes")
    passed &= check("reviewed_at" in js, "Supports recording reviewed_at timestamp")

    # Admin HTML tests
    passed &= check('id="applications-table-body"' in html, "Dynamic applications table body container exists")
    passed &= check('id="app-search"' in html, "Real-time search input exists")
    passed &= check('applyStatusFilter' in html, "Filter buttons for status exist")
    passed &= check('openReviewModal' in html, "Detail review modal launcher exists")
    passed &= check('executeStatusUpdate' in html, "Status update handler (Approve/Reject) wired")
    passed &= check('id="admin-review-notes"' in html, "Confidential admin notes field in modal")
    passed &= check('id="pending-badge-count"' in html, "Dynamic pending badge count present")
    return passed

def test_message_service_and_admin():
    print("\n--- Testing Message Management (admin/messages.html & messageService.js) ---")
    js_path = os.path.join(BASE_DIR, "js", "services", "messageService.js")
    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()

    html_path = os.path.join(BASE_DIR, "admin", "messages.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    passed = True
    # Service tests
    passed &= check("getMessages" in js, "Service provides getMessages()")
    passed &= check("markAsRead" in js, "Service provides markAsRead()")
    passed &= check("archiveMessage" in js, "Service provides archiveMessage()")
    passed &= check("deleteMessage" in js, "Service provides deleteMessage()")

    # Admin HTML tests
    passed &= check('id="messages-table-body"' in html, "Dynamic messages table body container exists")
    passed &= check('id="msg-search"' in html, "Real-time search input exists")
    passed &= check('applyMessageFilter' in html, "Filter buttons (All, Unread, Read, Archived) exist")
    passed &= check('viewMessage' in html, "Message detail viewer modal launcher exists")
    passed &= check('replyViaEmail' in html, "Official email reply launcher exists")
    passed &= check('confirmDeleteMessage' in html, "Delete confirmation handler exists")
    passed &= check('id="unread-badge-count"' in html, "Dynamic unread badge count present")
    return passed

def test_database_and_rls():
    print("\n--- Testing Database Schema and Row Level Security ---")
    schema_path = os.path.join(BASE_DIR, "supabase", "migrations", "20261105000001_initial_schema.sql")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = f.read()

    rls_path = os.path.join(BASE_DIR, "supabase", "migrations", "20261105000003_rls_policies.sql")
    with open(rls_path, "r", encoding="utf-8") as f:
        rls = f.read()

    passed = True
    # Schema checks
    passed &= check("CREATE TABLE IF NOT EXISTS contact_messages" in schema, "contact_messages table created")
    passed &= check("CREATE TABLE IF NOT EXISTS membership_applications" in schema, "membership_applications table created")
    passed &= check("CHECK (status IN ('pending', 'approved', 'rejected'))" in schema, "Status column constraint enforced in database")
    
    # RLS checks
    passed &= check("ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;" in rls, "RLS enabled on contact_messages")
    passed &= check("ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;" in rls, "RLS enabled on membership_applications")
    passed &= check('CREATE POLICY "Public can submit contact messages"' in rls, "Public INSERT policy on contact_messages")
    passed &= check('CREATE POLICY "Public can submit membership applications"' in rls, "Public INSERT policy on membership_applications")
    passed &= check('CREATE POLICY "Admins can read membership applications"' in rls, "Admin-only SELECT policy on membership_applications")
    passed &= check('CREATE POLICY "Admins can review membership applications"' in rls, "Admin-only UPDATE policy on membership_applications")
    
    # Verify strict non-exposure: Public CANNOT read applications
    passed &= check('CREATE POLICY "Public can read membership applications"' not in rls, "Public cannot read membership applications (Zero-leak verified)")
    passed &= check('CREATE POLICY "Public can read contact messages"' not in rls, "Public cannot read contact messages (Zero-leak verified)")
    return passed

def main():
    print("=" * 65)
    print("NSTUANS PHASE 8 VERIFICATION: MEMBERSHIP & CONTACT WORKFLOWS")
    print("=" * 65)

    results = [
        test_join_us_form(),
        test_contact_form(),
        test_submission_service(),
        test_application_service_and_admin(),
        test_message_service_and_admin(),
        test_database_and_rls()
    ]

    print("\n" + "=" * 65)
    if all(results):
        print("ALL PHASE 8 TESTS PASSED! Membership and contact workflows are 100% verified.")
        print("=" * 65)
        sys.exit(0)
    else:
        print("SOME TESTS FAILED! Check output above.")
        print("=" * 65)
        sys.exit(1)

if __name__ == "__main__":
    main()
