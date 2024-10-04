"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addArticleToSeries, fetchUserArticles } from './actions'; // Server actions
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Zod validation schema for selecting an article
const articleSelectionSchema = z.object({
    articleId: z.string().min(1, "You must select an article"),
});

type ArticleSelectionFormData = z.infer<typeof articleSelectionSchema>;

export default function AddArticle({ userId, seriesId }: { userId: string; seriesId: string }) {
    const [articles, setArticles] = useState<{ id: string; title: string }[]>([]);
    const { handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ArticleSelectionFormData>({
        resolver: zodResolver(articleSelectionSchema),
    });

    const [isPending, startTransition] = useTransition();

    // Fetch the user's existing articles on mount
    useEffect(() => {
        async function loadArticles() {
            const userArticles = await fetchUserArticles(userId); // Fetch articles using the server action
            setArticles(userArticles);
        }

        loadArticles();
    }, [userId]);

    // Watch articleId to update value when a selection is made
    const selectedArticle = watch('articleId');

    // Form submission handler
    const onSubmit = (data: ArticleSelectionFormData) => {
        startTransition(() => {
            addArticleToSeries({ articleId: data.articleId, seriesId });
            reset(); // Reset form fields after submission
        });
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size={'sm'}>
                        Add Article
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <h2 className="font-bold text-lg mb-2">Add Existing Article to Series</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <Select
                                onValueChange={(value) => setValue("articleId", value)} // Manually handle the value change
                                value={selectedArticle} // Set the current value of the select
                                disabled={isPending}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an Article" />
                                </SelectTrigger>
                                <SelectContent>
                                    {articles.map(article => (
                                        <SelectItem key={article.id} value={article.id}>
                                            {article.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.articleId && <p className="text-red-500">{errors.articleId.message}</p>}
                        </div>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Adding..." : "Add"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
