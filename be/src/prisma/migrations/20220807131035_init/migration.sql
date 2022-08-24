/*
  Warnings:

  - You are about to alter the column `paymentMethod` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Enum("Order_paymentMethod")`.
  - You are about to drop the column `is_active` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `is_blocked` on the `user` table. All the data in the column will be lost.
  - Made the column `fullname` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `paymentMethod` ENUM('Visa', 'Cash', 'Pending') NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `is_active`,
    DROP COLUMN `is_blocked`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `fullname` VARCHAR(255) NOT NULL;
