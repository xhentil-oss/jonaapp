USE appjonacademy_db;

ALTER TABLE users
  ADD COLUMN role ENUM('student','admin') NOT NULL DEFAULT 'student' AFTER membership_type;

-- After running this, promote your own account to admin by email:
-- UPDATE users SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';
