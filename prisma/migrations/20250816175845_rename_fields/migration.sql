/*
  Warnings:

  - You are about to drop the column `created_at` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `membership_type` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membershipType` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Member_member_id_key` ON `member`;

-- AlterTable
ALTER TABLE `member` DROP COLUMN `created_at`,
    DROP COLUMN `end_date`,
    DROP COLUMN `full_name`,
    DROP COLUMN `member_id`,
    DROP COLUMN `membership_type`,
    DROP COLUMN `start_date`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `fullName` VARCHAR(50) NOT NULL,
    ADD COLUMN `memberId` VARCHAR(10) NOT NULL,
    ADD COLUMN `membershipType` ENUM('monthly', 'quarterly', 'annual') NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Member_memberId_key` ON `Member`(`memberId`);
