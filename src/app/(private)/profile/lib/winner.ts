import { Competition } from "@prisma/client";

export const getWinnerLoser = (competition: Competition) => {
  if (!competition) {
    throw new Error("Invalid competition object");
  }

  const { challengerId, challengerScore, challengeeId, challengeeScore, status } = competition;

  if (status !== "completed") {
    throw new Error("Competition is not yet completed");
  }

  if (challengerScore === null || challengeeScore === null) {
    throw new Error("Scores are not available for both participants");
  }

  let winnerId = '';
  let loserId = '';

  if (challengerScore > challengeeScore) {
    winnerId = challengerId;
    loserId = challengeeId;
  } else if (challengerScore < challengeeScore) {
    winnerId = challengeeId;
    loserId = challengerId;
  } else {
    // Handle tie situation if needed
    return { message: "The competition ended in a tie." };
  }

  return {
    winnerId,
    loserId
  };
};
