"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Topic, Article, ArticleSection } from "@prisma/client";
import {
  ArrowUpIcon,
  CheckIcon,
  PlusCircledIcon,
  TrashIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { Separator } from "@/components/ui/separator";
import ErrorText from "./error-text";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { createManyQuestions } from "./actions";
import { useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const placeholder = `[
    {
      "content": "What is the capital of France?",
      "options": [{
        "text": "Berlin",
        "isCorrect": false
      }, {
        "text": "London",
        "isCorrect": false
      }, {
        "text": "Paris",
        "isCorrect": true
      }, {
        "text": "Rome",
        "isCorrect": false
      }],
      "hint": "It's a popular European tourist destination.",
      "explanation": "Paris is the capital of France."
    }
]`;

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  content: string;
  options: QuestionOption[];
  hint?: string;
  explanation?: string;
}

const questionSchema = z.object({
  topic: z.string().nonempty({ message: "Topic is required" }),
  article: z.string().optional(),
  articleSection: z.string().optional(),
  jsonData: z.string().nonempty({ message: "Json data is required" }),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

export default function CreateForm({
  topics,
  articles,
  articleSections,
}: {
  topics: Topic[];
  articles: Article[];
  articleSections: ArticleSection[];
}) {
  const searchParams = useSearchParams();
  const articleId = searchParams.get("articleId");
  const topicId = searchParams.get("topicId");
  const [isPending, startTransition] = useTransition();
  const [previewData, setPreviewData] = React.useState<Question[] | null>(null);
  const [jsonError, setJsonError] = React.useState<string | null>(null);

  const [isTopicOpen, setIsTopicOpen] = React.useState(false);
  const [isArticleOpen, setIsArticleOpen] = React.useState(false);
  const [isSectionOpen, setIsSectionOpen] = React.useState(false);
  const [sections, setSections] = React.useState<ArticleSection[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    setError,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const validateJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        throw new Error("Data must be an array of questions");
      }
      if (parsed.length === 0) {
        throw new Error("Array cannot be empty");
      }
      // Validate each question object
      parsed.forEach((q: Question, i) => {
        if (!q.content) throw new Error(`Question ${i + 1} is missing content`);
        if (!Array.isArray(q.options)) throw new Error(`Question ${i + 1} is missing options array`);
        if (q.options.length < 2) throw new Error(`Question ${i + 1} must have at least 2 options`);
        if (!q.options.some((opt: QuestionOption) => opt.isCorrect)) throw new Error(`Question ${i + 1} must have one correct option`);
      });
      setPreviewData(parsed);
      setJsonError(null);
      return true;
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON format");
      setPreviewData(null);
      return false;
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    if (!validateJson(data.jsonData)) {
      return;
    }

    startTransition(async () => {
      try {
        const questionIds = await createManyQuestions(
          data.topic,
          previewData!,
          data.article
        );
        // Reset form and show success message
        setValue("jsonData", "");
        setPreviewData(null);
      } catch (error) {
        console.error("An unexpected error occurred during submission", error);
        setError("jsonData", {
          type: "manual",
          message: "An unexpected error occurred. Please check the console for details.",
        });
      }
    });
  };

  useEffect(() => {
    if (articleId) {
      setValue("article", articleId);
    }
    if (topicId) {
      setValue("topic", topicId);
    }
  }, [articleId, setValue, topicId]);

  // Update the sections based on the selected article
  const selectedArticleId = watch("article");
  useEffect(() => {
    if (selectedArticleId) {
      const filteredSections = articleSections.filter(
        (section) => section.articleId === selectedArticleId
      );
      setSections(filteredSections);
    } else {
      setSections([]);
    }
  }, [selectedArticleId, articleSections]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label className="mb-1 block">Select Topic</Label>
          <Controller
            control={control}
            name="topic"
            render={({ field }) => (
              <Popover open={isTopicOpen} onOpenChange={setIsTopicOpen}>
                <PopoverTrigger className="w-full" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isTopicOpen}
                    className="w-full justify-between"
                    onClick={() => setIsTopicOpen(true)}
                  >
                    {field.value
                      ? topics.find((topic) => topic.id === field.value)?.name
                      : "Select topic..."}
                    <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search topic..." />
                    <CommandEmpty>No topic found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {Array.isArray(topics) && topics.length > 0 ? (
                          topics.map((topic) => (
                            <CommandItem
                              key={topic.id}
                              value={topic.name}
                              onSelect={(currentValue: string) => {
                                field.onChange(
                                  topics.find((t) => t.name === currentValue)?.id!
                                );
                                setIsTopicOpen(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === topic.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {topic.name}
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No topics available</CommandEmpty>
                        )}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.topic && <ErrorText text={errors.topic.message!} />}
        </div>

        <div>
          <Label className="my-2 block">Select Article (Optional)</Label>
          <Controller
            control={control}
            name="article"
            render={({ field }) => (
              <Popover open={isArticleOpen} onOpenChange={setIsArticleOpen}>
                <PopoverTrigger className="w-full" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isArticleOpen}
                    className="w-full justify-between"
                    onClick={() => setIsArticleOpen(true)}
                  >
                    {field.value
                      ? articles.find((article) => article.id === field.value)
                          ?.title
                      : "Select article..."}
                    <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search article..." />
                    <CommandEmpty>No article found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {Array.isArray(articles) && articles.length > 0 ? (
                          articles.map((article) => (
                            <CommandItem
                              key={article.id}
                              value={article.title}
                              onSelect={(currentValue: string) => {
                                field.onChange(
                                  articles.find((t) => t.title === currentValue)
                                    ?.id!
                                );
                                setIsArticleOpen(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === article.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {article.title}
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No articles available</CommandEmpty>
                        )}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <AnimatePresence>
          {selectedArticleId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Label className="my-2 block">Select Article Section (Optional)</Label>
              <Controller
                control={control}
                name="articleSection"
                render={({ field }) => (
                  <Popover open={isSectionOpen} onOpenChange={setIsSectionOpen}>
                    <PopoverTrigger className="w-full" asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isSectionOpen}
                        className="w-full justify-between"
                        onClick={() => setIsSectionOpen(true)}
                      >
                        {field.value
                          ? sections.find((section) => section.id === field.value)
                              ?.title
                          : "Select article section..."}
                        <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search section..." />
                        <CommandEmpty>No section found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {Array.isArray(sections) && sections.length > 0 ? (
                              sections.map((section) => (
                                <CommandItem
                                  key={section.id}
                                  value={section.title}
                                  onSelect={(currentValue: string) => {
                                    field.onChange(
                                      sections.find(
                                        (s) => s.title === currentValue
                                      )?.id!
                                    );
                                    setIsSectionOpen(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === section.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {section.title}
                                </CommandItem>
                              ))
                            ) : (
                              <CommandEmpty>No sections available</CommandEmpty>
                            )}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>JSON Input</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setValue("jsonData", placeholder)}
            >
              Load Example
            </Button>
          </div>

          <Controller
            control={control}
            name="jsonData"
            render={({ field }) => (
              <Textarea
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  validateJson(e.target.value);
                }}
                placeholder={placeholder}
                className="font-mono min-h-[300px]"
              />
            )}
          />

          {jsonError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{jsonError}</AlertDescription>
            </Alert>
          )}

          {previewData && (
            <Alert>
              <AlertTitle>Preview</AlertTitle>
              <AlertDescription>
                {previewData.length} questions loaded successfully
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Card className="p-4 bg-muted/50">
          <div className="flex items-start gap-2">
            <InfoCircledIcon className="h-5 w-5 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium">JSON Format Help</h3>
              <p className="text-sm text-muted-foreground">
                Each question should have:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>content: The question text</li>
                <li>options: Array of answer options with text and isCorrect flag</li>
                <li>hint (optional): A hint for the question</li>
                <li>explanation (optional): Explanation of the correct answer</li>
              </ul>
            </div>
          </div>
        </Card>

        <Button 
          className="w-full" 
          type="submit"
          disabled={isPending || !!jsonError}
        >
          {isPending ? "Creating Questions..." : "Create Questions"}
        </Button>
      </div>
    </form>
  );
}
