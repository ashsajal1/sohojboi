"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question, Topic } from "@prisma/client";
import { editQuestion } from "./actions";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ArrowUpIcon, CheckIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import DeleteQuestion from "./delete-question";
import { cn } from "@/lib/utils";

const EditQuestion = ({ question, topics }: { question: Question; topics: Topic[] }) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const questionSchema = z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 100 characters")
      .nonempty("Title is required"),
    content: z
      .string()
      .min(10, "Content must be at least 10 characters")
      .max(10000, "Content must not exceed 10000 characters")
      .nonempty("Content is required"),
    topicId: z.string({ required_error: "Topic selection is required" }).nonempty("Topic selection is required"),
  });

  const formMethods = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: question.content,
      content: question.description,
      topicId: question.topicId,
    },
  });

  const handleSave = async () => {
    startTransition(async () => {
      await editQuestion(
        formMethods.getValues("title"),
        formMethods.getValues("content"),
        formMethods.getValues("topicId")!,
        question.id
      );
      formMethods.reset();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>Edit question</h2>
        <DeleteQuestion questionId={question.id!} />
      </div>
      <form onSubmit={formMethods.handleSubmit(handleSave)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Topic</h2>
            <Controller
              control={formMethods.control}
              name="topicId"
              render={({ field }) => (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger className="w-full" asChild>
                    <Button
                      disabled={pending}
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      onClick={() => setOpen(true)}
                    >
                      {field.value
                        ? topics.find((topic) => topic.id === field.value)?.name
                        : "Select topic..."}
                      <ArrowUpIcon className="ml-2 -rotate-180 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search topic..." />
                      <CommandEmpty>No topic found.</CommandEmpty>
                      <CommandList>
                        {Array.isArray(topics) && topics.length > 0 ? (
                          topics.map((topic) => (
                            <CommandItem
                              key={topic.id}
                              value={topic.name}
                              onSelect={(currentValue) => {
                                field.onChange(topics.find((t) => t.name === currentValue)?.id);
                                setOpen(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === topic.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {topic.name}
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No topics available</CommandEmpty>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {formMethods.formState.errors.topicId && (
              <p className="text-sm text-red-500">{formMethods.formState.errors.topicId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Question</h2>
            <Input
              disabled={pending}
              placeholder="Type your question here"
              {...formMethods.register("title")}
            />
            {formMethods.formState.errors.title && (
              <p className="text-sm text-red-500">{formMethods.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Content</h2>
            <Textarea
              disabled={pending}
              rows={10}
              placeholder="Type your content here"
              {...formMethods.register("content")}
            />
            {formMethods.formState.errors.content && (
              <p className="text-sm text-red-500">{formMethods.formState.errors.content.message}</p>
            )}
          </div>
          <Button disabled={pending} className="w-full" type="submit">
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;