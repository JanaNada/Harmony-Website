-- Scheduling + chat.
-- Purely additive: no existing table is dropped or rewritten.

-- The public site offers a Technology service, but the enum predates it.
ALTER TABLE `service_requests`
  MODIFY COLUMN `service_type` enum(
    'MANAGEMENT','EVENTS','MARKETING','RECRUITMENT',
    'FNB','CATERING','TECHNOLOGY','OTHER'
  ) NOT NULL;

-- Availability the admin opens up. One shared Harmony calendar, so a start
-- time is unique: the admin cannot be in two meetings at once, which is what
-- makes "booked blocks everyone else" true at the database level.
CREATE TABLE IF NOT EXISTS `availability_slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `status` enum('OPEN','REQUESTED','BOOKED','CLOSED') NOT NULL DEFAULT 'OPEN',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slot_start` (`starts_at`),
  KEY `idx_slot_status` (`status`),
  CONSTRAINT `fk_slot_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Which services a given slot is open for. A slot can cover one service,
-- several, or all of them.
CREATE TABLE IF NOT EXISTS `availability_slot_services` (
  `slot_id` int NOT NULL,
  `service_type` enum(
    'MANAGEMENT','EVENTS','MARKETING','RECRUITMENT',
    'FNB','CATERING','TECHNOLOGY','OTHER'
  ) NOT NULL,
  PRIMARY KEY (`slot_id`,`service_type`),
  CONSTRAINT `fk_slot_service` FOREIGN KEY (`slot_id`)
    REFERENCES `availability_slots` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A company asking to move an existing meeting, or the admin proposing a new
-- time. Whoever receives it approves or declines.
CREATE TABLE IF NOT EXISTS `meeting_reschedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_request_id` int NOT NULL,
  `proposed_slot_id` int NOT NULL,
  `message` text,
  `status` enum('PENDING','APPROVED','DECLINED') NOT NULL DEFAULT 'PENDING',
  `requested_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reschedule_request` (`service_request_id`,`status`),
  CONSTRAINT `fk_resched_request` FOREIGN KEY (`service_request_id`)
    REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resched_slot` FOREIGN KEY (`proposed_slot_id`)
    REFERENCES `availability_slots` (`id`),
  CONSTRAINT `fk_resched_author` FOREIGN KEY (`requested_by`)
    REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Chat between the admin and a company.
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `sender_user_id` int NOT NULL,
  `body` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_messages_company` (`company_id`,`id`),
  CONSTRAINT `fk_message_company` FOREIGN KEY (`company_id`)
    REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_user_id`)
    REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
