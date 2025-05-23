-- Contact form submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending'
);

-- Create index on email for quicker lookups
CREATE INDEX IF NOT EXISTS contact_submissions_email_idx ON contact_submissions(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON contact_submissions(status);

-- Row-level security policy: Only authenticated users with admin role can see all submissions
CREATE POLICY "Admins can see all contact submissions" ON contact_submissions
  FOR SELECT USING (
    auth.role() = 'admin'
  );

-- Enable row-level security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
