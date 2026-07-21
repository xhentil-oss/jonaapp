USE appjonacademy_db;

CREATE TABLE notifications (
  id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED  NOT NULL,
  type        ENUM('kurs', 'certifikatë') NOT NULL,
  titulli     VARCHAR(255)     NOT NULL,
  mesazhi     VARCHAR(500)     NOT NULL,
  lexuar      TINYINT(1)       NOT NULL DEFAULT 0,
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user (user_id, created_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
