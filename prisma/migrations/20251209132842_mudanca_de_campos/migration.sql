/*
  Warnings:

  - You are about to drop the column `legenda` on the `imagens` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `projetos` table. All the data in the column will be lost.
  - Made the column `descricao` on table `projetos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoria` on table `projetos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."imagens" DROP COLUMN "legenda";

-- AlterTable
ALTER TABLE "public"."projetos" DROP COLUMN "data",
ALTER COLUMN "descricao" SET NOT NULL,
ALTER COLUMN "categoria" SET NOT NULL;
