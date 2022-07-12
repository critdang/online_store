/*
  Warnings:

  - You are about to alter the column `status` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum("Order_status")`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('Pending', 'Completed') NOT NULL;
