"use client"
import { useState } from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question, Topic } from "@prisma/client";
import { editQuestion } from "./actions";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel } from "@/components/ui/select";

const EditQuestion = ({ question, topics }: { question: Question, topics: Topic[] }) => {
    const [title, setTitle] = useState(question.questionTitle);
    const [content, setContent] = useState(question.questionDescription);
    const [topicId, setTopicId] = useState(question.topicId);
    const [pending, startTransition] = useTransition();

    const handleSave = async () => {
        startTransition(async () => {
            await editQuestion(title, content, topicId!, question.id);
        });
    };

    return (
        <div className="space-y-4">
            <InputFields
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                topicId={question.topicId!}
                setTopicId={setTopicId}
                topics={topics}
                pending={pending}
            />

            <Button disabled={pending} className="w-full" onClick={handleSave}>Save</Button>

        </div>
    );
};

const InputFields = ({
    title,
    setTitle,
    content,
    setContent,
    topicId,
    setTopicId,
    topics,
    pending
}: {
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    topicId: string;
    setTopicId: (topicId: string) => void;
    topics: Topic[],
    pending: boolean
}) => {

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h2 className="text-lg font-medium">Topic</h2>
                <Select disabled={pending} onValueChange={(newValue) => setTopicId(newValue)} defaultValue={topicId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a topic">

                        </SelectValue>
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
            </div>
            <div className="space-y-2">
                <h2 className="text-lg font-medium">Question</h2>
                <Input
                    disabled={pending}
                    defaultValue={title}
                    placeholder="Type your question here"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <h2 className="text-lg font-medium">Content</h2>
                <Textarea
                    disabled={pending}
                    defaultValue={content}
                    rows={10}
                    placeholder="Type your content here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        </div>
    );
};

export default EditQuestion;
