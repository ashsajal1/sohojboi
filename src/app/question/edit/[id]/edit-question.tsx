"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question, Topic } from "@prisma/client";
import { editQuestion } from "./actions";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditQuestion = ({ question, topics }: { question: Question; topics: Topic[] }) => {
  const [pending, startTransition] = useTransition();

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
      title: question.questionTitle,
      content: question.questionDescription,
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
      <form onSubmit={formMethods.handleSubmit(handleSave)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Topic</h2>
            <Select
              disabled={pending}
              onValueChange={(newValue) => formMethods.setValue("topicId", newValue)}
              defaultValue={question.topicId!}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Topic</SelectLabel>
                  {topics.map((topic) => (
                    <SelectItem value={topic.id} key={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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