"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "./actions";
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
import { Topic } from "@prisma/client";
import { questionSchema } from "./schema";

const CreateQuestion = ({ topics }: { topics: Topic[] }) => {
  const [pending, startTransition] = useTransition();

  const formMethods = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      content: '',
      topicId: '',
    },
  });

  const handleSave = async () => {
    console.log("Saving question...");
    startTransition(async () => {
      const res = await createQuestion(
        formMethods.getValues("title"),
        formMethods.getValues("content"),
        formMethods.getValues("topicId")!,
      );
      console.log(res)
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
            {pending ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;