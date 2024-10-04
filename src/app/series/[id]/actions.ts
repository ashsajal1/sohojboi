"use server";

import prisma from '@/lib/prisma';
import {revalidatePath} from "next/cache"

export async function addArticleToSeries({ articleId, seriesId }: { articleId: string, seriesId: string }) {
    try {
        await prisma.article.update({
            where: {
                id: articleId,
            },
            data: {
                blogSeriesId: seriesId,
            },
        });
        // console.log("Article successfully added to the series");
        revalidatePath(`/series/${seriesId}`)
    } catch (error) {
        console.error("Failed to add article to the series:", error);
        throw new Error("Unable to add the article to the series.");
    }
}

export async function fetchUserArticles(userId: string) {
    try {
        const articles = await prisma.article.findMany({
            where: {
                authorId: userId,
            },
            select: {
                id: true,
                title: true,
            },
        });
        // console.log(articles)
        return articles;
    } catch (error) {
        console.error("Failed to fetch user articles:", error);
        throw new Error("Unable to fetch user articles.");
    }
}
