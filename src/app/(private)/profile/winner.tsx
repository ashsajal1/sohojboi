import { Badge } from "@/components/ui/badge";
import { clerkClient } from "@clerk/nextjs/server";

export const Winner = async ({ challengerId, challengeeId, userId, challengerScore, challengeeScore }: { challengerId: string, challengeeId: string, userId: string, challengerScore: number, challengeeScore: number }) => {
    let resultText = '';
    let badgeVariant: 'secondary' | 'destructive' = 'secondary';

    const challenger = await clerkClient().users.getUser(challengerId);
    const challengee = await clerkClient().users.getUser(challengeeId);

    if (challengerScore === challengeeScore) {
        resultText = 'It\'s a draw';
    } else {
        const winnerId = challengerScore > challengeeScore ? challengerId : challengeeId;
        const winnerName = winnerId === challengerId ? challenger.fullName : challengee.fullName;
        const loserName = winnerId === challengerId ? challengee.fullName : challenger.fullName;
        const userWon = winnerId === userId;

        if (userWon) {
            resultText = `${winnerName} won against ${loserName}`;
            badgeVariant = 'secondary';
        } else {
            resultText = `${loserName} lost against ${winnerName}`;
            badgeVariant = 'destructive';
        }
    }

    return (
        <Badge variant={badgeVariant}>
            {resultText}
        </Badge>
    );
}