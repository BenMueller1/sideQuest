-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personaEmbedding" DOUBLE PRECISION[];

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option3" TEXT NOT NULL,
    "option4" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
