import ProfileImgCard from "@/components/profile-img-card";
import { getWinnerLoser } from "./lib/utils";
import { Names } from "./names";
import { CardContent } from "@/components/ui/card";
import { Competition } from "@prisma/client";

const ProfileData = ({ challenge }: { challenge: Competition }) => {
    const { winnerId } = getWinnerLoser(challenge)
    const isDraw = challenge.challengerScore === challenge.challengeeScore;

    return <CardContent>

        <Names challenge={challenge} />
        <div className="flex items-center justify-between">
            <ProfileImgCard
                type={"challengeResult"}
                userId={challenge.challengerId}
                challengeStatus={isDraw ? 'draw' : (challenge.challengerId === winnerId ? 'winner' : 'loser')}
            />
            <ProfileImgCard
                leftSideImage={false}
                type={"challengeResult"}
                userId={challenge.challengeeId}
                challengeStatus={isDraw ? 'draw' : (challenge.challengeeId === winnerId ? 'winner' : 'loser')}
            />
        </div>

    </CardContent>
}


export default ProfileData;