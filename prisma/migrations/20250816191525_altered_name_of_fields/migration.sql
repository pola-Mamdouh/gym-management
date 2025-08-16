/*
  Warnings:

  - You are about to alter the column `email` on the `member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - The values [inactive] on the enum `Member_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `member` MODIFY `email` VARCHAR(100) NULL,
    MODIFY `status` ENUM('active', 'expired', 'suspended') NOT NULL DEFAULT 'active';
