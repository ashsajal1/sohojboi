"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { seriesSchema } from "./validation"; // Import your Zod schema
import { createSeries } from "./actions";

// Define the form data type using Zod's inference
type SeriesFormData = z.infer<typeof seriesSchema>;

export default function SeriesForm({userId}:{userId: string}) {
  // Initialize the form with react-hook-form and Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeriesFormData>({
    resolver: zodResolver(seriesSchema), // Zod validation
  });

  const onSubmit = (data: SeriesFormData) => {
    createSeries(data.title, userId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <Input
          placeholder="Series name eg. Javascript tutorials, Biology chapter 1"
          {...register("title")} // Register the input with react-hook-form
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>} {/* Display validation errors */}
      </div>

      <Button className="mt-2" type="submit">
        Create
      </Button>
    </form>
  );
}
