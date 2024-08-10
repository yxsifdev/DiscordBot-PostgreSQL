-- CreateEnum
CREATE TYPE "Action" AS ENUM ('Warn', 'Mute', 'Kick', 'Ban');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "badges" TEXT[],
    "rank" TEXT NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "caseCounter" INTEGER NOT NULL DEFAULT 0,
    "muteRole" TEXT,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "action" "Action" NOT NULL,
    "reason" TEXT NOT NULL,
    "case" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muteEnd" TIMESTAMP(3),
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guild_guildId_key" ON "Guild"("guildId");

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
