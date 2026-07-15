USE appjonacademy_db;

ALTER TABLE users
  ADD COLUMN reset_token_hash VARCHAR(255) NULL AFTER password_hash,
  ADD COLUMN reset_token_expires DATETIME NULL AFTER reset_token_hash;
