import React, { ReactNode } from 'react';
import { Question } from '@prisma/client';

interface ServerWrapperProps {
    children: ReactNode;
    questions: Question[];
}

export default function ServerWrapper({ children, questions }: ServerWrapperProps) {
    return (
        <div>
            {children}
        </div>
    );
}
