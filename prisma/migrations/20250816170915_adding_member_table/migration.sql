-- CreateTable
CREATE TABLE `Member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(50) NOT NULL,
    `member_id` VARCHAR(10) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(15) NULL,
    `membership_type` ENUM('monthly', 'quarterly', 'annual') NOT NULL,
    `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_date` DATETIME(3) NULL,
    `notes` VARCHAR(200) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Member_member_id_key`(`member_id`),
    UNIQUE INDEX `Member_email_key`(`email`),
    UNIQUE INDEX `Member_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
