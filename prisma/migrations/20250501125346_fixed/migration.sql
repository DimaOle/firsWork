/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `provider` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ProviderEnum" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "RoleEnum"[],
DROP COLUMN "provider",
ADD COLUMN     "provider" "ProviderEnum";

-- DropEnum
DROP TYPE "Provider";

-- DropEnum
DROP TYPE "Role";
