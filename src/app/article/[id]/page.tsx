import { Button } from "@/components/ui/button";
import {
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import CommentForm from "./comment-form";
import Comment from "./comment";
import { Metadata } from "next";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { increaseView } from "@/app/_actions/increase-view";
import ProfileImgCard from "@/components/profile-img-card";
import UpvoteArticle from "./upvote";
import Content from "../../../components/content";
import Link from "next/link";
import ShareBtn from "@/components/share-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
  ClockIcon,
  EyeOpenIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import ArticleQuestion from "./quiz";
import { Separator } from "@/components/ui/separator";
import { checkRole } from '@/lib/roles';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const articleId = params.id;
  let article;
  try {
    article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
  } catch (err) {
    throw new Error("Invalid article id!");
  }

  const author = await clerkClient().users.getUser(article?.authorId!);
  const profileImg = await author.imageUrl;
  const authorName = await author.fullName;
  const formattedDate = new Date(article?.createdAt!).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      year: "numeric",
      month: "short",
    }
  );

  const ogImage = `/api/og?title=${article?.title}&profileImg=${profileImg}&date=${formattedDate}&authorName=${authorName}`;

  return {
    title: article?.title,
    description: article?.content?.slice(1, 150),
    openGraph: {
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const articleId = params.id;
  const userId = await auth().userId;
  let isUpvoted;
  let article;
  let relatedArticles;
  let quiz;

  try {
    article = await prisma.article.findUnique({
      where: {
        id: articleId,
        deletedAt: null,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        upvotes: true,
        blogSeries: {
          include: {
            articles: true,
          },
        },
        sections: true,
      },
    });

    relatedArticles = await prisma.article.findMany({
      where: {
        topicId: article?.topicId,
        deletedAt: null,
        id: {
          not: article?.id,
        },
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });

    quiz = await prisma.challengeQuestion.findMany({
      where: {
        articleId: articleId,
      },
      include: {
        options: true,
        articleSection: true,
      },
    });
  } catch (err) {
    throw new Error("Invalid article id!");
  }

  const randomQuiz = quiz[Math.floor(Math.random() * quiz.length)];
  // Create table of contents in Markdown format
  const tableOfContentsMd =
    `## Table of Contents\n\n` +
    (article?.sections
      .sort((a, b) => a.position - b.position)
      .map(
        (section, index) =>
          `> [**${index + 1}.** ${section.title}](#${section.title
            .replace(/\s+/g, "-")
            .toLowerCase()})`
      )
      .join("\n\n") || "");

  if (userId) {
    isUpvoted = await prisma.upvote.findUnique({
      where: {
        userId_articleId: {
          userId: userId!,
          articleId: articleId,
        },
      },
    });
  }

  const viewCount = await prisma.view.aggregate({
    _sum: {
      count: true,
    },
    where: {
      articleId: {
        in: [articleId],
      },
    },
  });

  if (userId) {
    await increaseView(userId, article?.id!, "article");
  }

  const wordsPerMinute = 200;

  const timeToRead = article?.content
    ? (article.content.split(" ").length / wordsPerMinute).toFixed(0)
    : (
        (article?.sections || [])
          .map((section) => section.content || "")
          .join(" ")
          .split(" ").length / wordsPerMinute
      ).toFixed(0);

  const isInSeries = article?.blogSeriesId !== null;
  const quizBySection = (sectionId: string) => {
    return quiz.find((q) => q.articleSection?.id === sectionId);
  };

  return (
    <div className="max-w-full mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-2xl md:text-3xl font-bold dark:text-gray-100">{article?.title}</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground/70">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{timeToRead} mins read</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeOpenIcon className="w-4 h-4" />
              <span>{viewCount._sum.count || 0} views</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="dark:text-gray-100">
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
            {userId === article?.authorId && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="dark:text-gray-100">Actions</DropdownMenuLabel>
                  <Link
                    className="w-full"
                    href={`/article/edit/${article?.id}`}
                  >
                    <DropdownMenuItem className="w-full dark:text-gray-100 dark:hover:bg-gray-700">
                      <Pencil1Icon className="mr-1" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    className="w-full"
                    href={`/article/edit/${article?.id}`}
                  >
                    <DropdownMenuItem className="w-full dark:text-gray-100 dark:hover:bg-gray-700">
                      <TrashIcon className="mr-1" />
                      Delete
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator className="dark:bg-gray-700" />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="dark:text-gray-100">Reports</DropdownMenuLabel>
              <DropdownMenuItem className="w-full dark:text-gray-100 dark:hover:bg-gray-700">
                <TrashIcon className="mr-1" />
                Spam
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-6">
        {isInSeries && (
          <div className="p-4 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 mb-3">
              <BookmarkIcon className="w-5 h-5 text-blue-500" />
              <p className="text-sm font-medium dark:text-gray-100">
                This article is a part of{" "}
                <Link
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  href={`/series/${article?.blogSeriesId}`}
                >
                  {article?.blogSeries?.title}
                </Link>{" "}
                series
              </p>
            </div>
            <div className="space-y-2">
              {article?.blogSeries?.articles
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((article, index) => (
                  <Link
                    className="w-full block"
                    href={`/article/${article.id}`}
                    key={article.id}
                  >
                    <Button
                      className="w-full text-start justify-start"
                      variant={article.id === params.id ? "secondary" : "outline"}
                    >
                      <span className="font-medium mr-2">#{index + 1}</span>
                      {article.title.slice(0, 40)}...
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {tableOfContentsMd && (
          <div className="p-4 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50">
            <Content content={tableOfContentsMd} />
          </div>
        )}

        <div className="space-y-8">
          {article?.sections
            .sort((a, b) => a.position - b.position)
            .map((section) => (
              <div
                key={section.id}
                id={section.title.replace(/\s+/g, "-").toLowerCase()}
                className="scroll-mt-20"
              >
                <Content
                  key={section.id}
                  content={`## **${section.title}**\n\n${section.content}`}
                />

                {quizBySection(section.id) && (
                  <div className="py-4">
                    <ArticleQuestion
                      showConfetti
                      question={quizBySection(section.id)!}
                    />
                  </div>
                )}
              </div>
            ))}

          {!article?.sections.length && article?.content && (
            <Content content={article.content} />
          )}

          {quiz.length > 0 && (
            <div className="py-4">
              <ArticleQuestion showConfetti question={randomQuiz!} />
            </div>
          )}

          <div className="py-4">
            <Link href={`/quiz/create?articleId=${article?.id}`}>
              <Button variant="outline" className="w-full dark:border-gray-700 dark:hover:bg-gray-800">
                Create quiz on this article
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Separator className="dark:bg-gray-700" />

      <div className="flex items-center justify-between">
        <ProfileImgCard
          createdAt={article?.createdAt}
          type={"article"}
          userId={article?.authorId!}
        />

        <div className="flex items-center gap-2">
          <UpvoteArticle
            upvoteCount={article?.upvotes.length!}
            article={article!}
            isUpvoted={!!isUpvoted}
          />
          <ShareBtn
            title={article?.title!}
            description={article?.content?.slice(0, 150)!}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Comments</h2>
          {userId ? (
            <CommentForm articleId={articleId} />
          ) : (
            <p className="text-muted-foreground">
              Please{" "}
              <Link className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" href="/login">
                Login
              </Link>{" "}
              to comment
            </p>
          )}
        </div>

        <div className="space-y-4">
          {article?.comments && await Promise.all(
            article.comments
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(async (comment) => {
                const user = await clerkClient().users.getUser(comment.authorId);
                const serializedUser = {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  imageUrl: user.imageUrl,
                  username: user.username
                };
                const isUpvoted = userId ? await prisma.upvote.findUnique({
                  where: {
                    userId_commentId: {
                      userId,
                      commentId: comment.id
                    }
                  }
                }) : false;
                const upvoteCount = await prisma.upvote.aggregate({
                  _count: {
                    userId: true
                  },
                  where: {
                    commentId: comment.id
                  }
                });
                const hasPermission = userId === comment.authorId || await checkRole("admin");
                const commentReplies = await prisma.comment.findMany({
                  where: {
                    parentId: comment.id,
                    deletedAt: null
                  }
                });

                return (
                  <Comment 
                    key={comment.id} 
                    comment={comment}
                    user={serializedUser}
                    isUpvoted={!!isUpvoted}
                    upvoteCount={upvoteCount._count.userId}
                    hasPermission={hasPermission}
                    commentReplies={commentReplies}
                  />
                );
              })
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold dark:text-gray-100">Read more</h2>
        <div className="grid gap-3">
          {relatedArticles.map((article) => (
            <Link
              className="block p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              href={`/article/${article.id}`}
              key={article.id}
            >
              <h3 className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
