"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { seriesSchema } from "./validation"; // Import your Zod schema
import { createSeries } from "./actions";
import { useTransition } from "react";
import LoaderIcon from "@/components/loader-icon";

// Define the form data type using Zod's inference
type SeriesFormData = z.infer<typeof seriesSchema>;

export default function SeriesForm({ userId }: { userId: string }) {
  // Initialize the form with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeriesFormData>({
    resolver: zodResolver(seriesSchema), // Zod validation
  });

  // Use useTransition to manage the loading state
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: SeriesFormData) => {
    startTransition(() => {
      createSeries(data.title, userId);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <Input
          placeholder="Series name eg. Javascript tutorials, Biology chapter 1"
          {...register("title")} // Register the input with react-hook-form
          disabled={isPending} // Disable input while pending
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message}</p>
        )} {/* Display validation errors */}
      </div>

      <Button className="mt-2" type="submit" disabled={isPending}>
        {isPending ? <LoaderIcon /> : "Create"} {/* Button text changes based on state */}
      </Button>
    </form>
  );
}
