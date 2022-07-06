/*
  Warnings:

  - You are about to drop the column `amount` on the `cartproduct` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `product` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to drop the column `total` on the `productinorder` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `productinorder` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - Added the required column `quantity` to the `CartProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cartproduct` DROP COLUMN `amount`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `quantity`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    MODIFY `price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `productinorder` DROP COLUMN `total`,
    MODIFY `price` DECIMAL(65, 30) NOT NULL;
