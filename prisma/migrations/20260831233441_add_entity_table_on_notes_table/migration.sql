/*
  Warnings:

  - Added the required column `entity_table` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "entity_table" TEXT NOT NULL;
