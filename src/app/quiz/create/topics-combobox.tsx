"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ArrowUpIcon, CheckIcon } from "@radix-ui/react-icons"
import { Topic } from "@prisma/client"

export function TopicsCombobox(
    { topics }: { topics: Topic[] }
) {
    console.log(topics)
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? topics.find((topic) => topic.id === value)?.name
                        : "Select topic..."}
                    <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search topic..." />
                    <CommandEmpty>No topic found.</CommandEmpty>
                    <CommandGroup>
                        {Array.isArray(topics) && topics.length > 0 ? (
                            topics.map((topic) => (
                                <CommandItem
                                    key={topic.id}
                                    value={topic.name}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === topic.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {topic.name}
                                </CommandItem>
                            ))
                        ) : (
                            <CommandEmpty>No topics available</CommandEmpty>
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
