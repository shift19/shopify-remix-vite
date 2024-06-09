-- AlterTable
ALTER TABLE `sessions` ADD COLUMN `account_owner` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `collaborator` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `email_verified` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `first_name` VARCHAR(191) NULL,
    ADD COLUMN `last_name` VARCHAR(191) NULL,
    ADD COLUMN `locale` VARCHAR(191) NULL;
