"use client"

import { Card, CardTitle } from "@/components/ui/card";
import { User } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTransition, useState, useEffect } from "react";
import LoaderIcon from "@/components/loader-icon";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandItem, CommandInput, CommandList } from "@/components/ui/command";
import { Topic } from '@prisma/client';
import { ArrowUpIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { getTopics } from "./actions";
import { Label } from "@/components/ui/label";

export default function Select({ users, userId }: { users: User[], userId: string }) {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    const [pending, startTransiton] = useTransition();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [topics, setTopics] = useState<Topic[] | null>(null);
    useEffect(() => {
        const fetchTopics = async () => {
            const fetchedTopics: Topic[] = await getTopics(); // Fetch the topics
            setTopics(fetchedTopics); // Update the state
        };

        fetchTopics(); // Call the async function
    }, [])

    const handleSelect = (challengeeId: string) => {
        if (selectedUserId) {
            handleSearchParms(challengeeId);
        } else {
            setSelectedUserId(challengeeId);
            handleSearchParms(challengeeId);
        }
    }

    const handleSearchParms = async (challengeeId: string) => {
        const params = new URLSearchParams(searchParams);

        await startTransiton(async () => {
            await params.set('challengeeId', challengeeId);
            await params.set('topicId', selectedTopicId || '');
            await replace(`${pathName}?${params.toString()}`);
        });
    };

    const filteredUsers = users.filter(user => user.id !== userId);

    return (
        <div>
            <div className="flex flex-col justify-between items-start">
                {/* Select topic  */}
                <Label className='mb-2'>Select Topic</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger className='w-full mb-2' asChild>
                        <Button
                            disabled={pending}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                            onClick={() => setOpen(true)}
                        >
                            {selectedTopicId
                                ? topics?.find((topic) => topic.id === selectedTopicId)?.name
                                : "Select topic..."}
                            <ArrowUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search topic..." />
                            <CommandEmpty>No topic found.</CommandEmpty>
                            <CommandList>
                                {topics?.map((topic) => (
                                    <CommandItem
                                        key={topic.id}
                                        value={topic.name}
                                        onSelect={(currentValue) => {
                                            const foundTopic = topics.find((t) => t.name === currentValue);
                                            setSelectedTopicId(foundTopic ? foundTopic.id : null); // Ensure it's a string or null
                                            setOpen(false);
                                        }}
                                    >
                                        <CheckIcon className={cn("mr-2 h-4 w-4", selectedTopicId === topic.name ? "opacity-100" : "opacity-0")} />
                                        {topic.name}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <Label className='mb-2'>Select Challengee</Label>
            <div className="grid grid-cols-1 w-full md:grid-cols-3 gap-2 mt-1">
                {filteredUsers.map(user => (
                    <Card className="flex w-full items-center justify-between p-4 gap-2" key={user.id}>
                        <div className="flex items-center gap-2">
                            <Image className="rounded-full" width={30} height={30} src={user.imageUrl} alt={"Profile image"} />
                            <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                        </div>
                        <Button
                            disabled={pending && selectedUserId === user.id}
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelect(user.id)}
                        >
                            {pending && selectedUserId === user.id ? <><LoaderIcon /> Selecting</> : 'Select'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}