/*
  Warnings:

  - You are about to drop the column `is_default` on the `product_image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product_image` DROP COLUMN `is_default`,
    ADD COLUMN `isDefault` BOOLEAN NOT NULL DEFAULT false;
