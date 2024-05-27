/*
  Warnings:

  - You are about to drop the column `tmdbId` on the `ScheduledMovie` table. All the data in the column will be lost.
  - You are about to drop the column `tmdbId` on the `WatchedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `tmdbId` on the `Watchlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[movieId]` on the table `ScheduledMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId]` on the table `WatchedMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `movieId` to the `ScheduledMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieId` to the `WatchedMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movieId` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ScheduledMovie_tmdbId_key";

-- DropIndex
DROP INDEX "WatchedMovie_tmdbId_key";

-- DropIndex
DROP INDEX "Watchlist_tmdbId_key";

-- AlterTable
ALTER TABLE "ScheduledMovie" DROP COLUMN "tmdbId",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WatchedMovie" DROP COLUMN "tmdbId",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "tmdbId",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledMovie_movieId_key" ON "ScheduledMovie"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchedMovie_movieId_key" ON "WatchedMovie"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_movieId_key" ON "Watchlist"("movieId");
