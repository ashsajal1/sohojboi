"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from "./actions";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Topic } from "@prisma/client";
import { questionSchema } from "./schema";
import { useForm, Controller } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { ArrowUpIcon, CheckIcon } from "lucide-react";
import LoaderIcon from "@/components/loader-icon";

const CreateQuestion = ({ topics }: { topics: Topic[] }) => {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  
  const formMethods = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      content: '',
      topicId: '',
    },
  });

  const handleSave = async () => {
    startTransition(async () => {
      const res = await createQuestion(
        formMethods.getValues("title"),
        formMethods.getValues("content"),
        formMethods.getValues("topicId")!,
      );
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={formMethods.handleSubmit(handleSave)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Topic</h2>
            <Controller
              control={formMethods.control}
              name="topicId"
              render={({ field }) => (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger className='w-full' asChild>
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
                      <ArrowUpIcon className="ml-2 h -4 w-4 shrink-0 opacity-50" />
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
            {pending ? <LoaderIcon /> : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;