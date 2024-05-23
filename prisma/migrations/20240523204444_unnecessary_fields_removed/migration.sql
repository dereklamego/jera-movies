/*
  Warnings:

  - You are about to drop the column `posterPath` on the `ScheduledMovie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `ScheduledMovie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ScheduledMovie` table. All the data in the column will be lost.
  - You are about to drop the column `posterPath` on the `WatchedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `WatchedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `WatchedMovie` table. All the data in the column will be lost.
  - You are about to drop the column `posterPath` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Watchlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tmdbId]` on the table `ScheduledMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmdbId]` on the table `WatchedMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmdbId]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ScheduledMovie" DROP COLUMN "posterPath",
DROP COLUMN "releaseDate",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "WatchedMovie" DROP COLUMN "posterPath",
DROP COLUMN "releaseDate",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "posterPath",
DROP COLUMN "releaseDate",
DROP COLUMN "title";

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledMovie_tmdbId_key" ON "ScheduledMovie"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchedMovie_tmdbId_key" ON "WatchedMovie"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_tmdbId_key" ON "Watchlist"("tmdbId");
