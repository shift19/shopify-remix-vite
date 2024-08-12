/*
  Warnings:

  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[shop]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_id]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shop_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sessions` DROP PRIMARY KEY,
    ADD COLUMN `shop_id` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `sessions_shop_key` ON `sessions`(`shop`);

-- CreateIndex
CREATE UNIQUE INDEX `sessions_shop_id_key` ON `sessions`(`shop_id`);
