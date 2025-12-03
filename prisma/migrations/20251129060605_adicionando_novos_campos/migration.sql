-- AlterTable
ALTER TABLE "projetos" ADD COLUMN     "cliente" TEXT,
ADD COLUMN     "prazo" TIMESTAMP(3),
ADD COLUMN     "responsavel" TEXT;
