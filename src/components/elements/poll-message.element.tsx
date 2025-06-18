import React, { useState, useEffect } from "react";
import { Check, Users, Clock, BarChart3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Message from "@/types/message.model";
import { Member } from "@/types/member.model";

interface PollMessageRealProps {
  message: Message;
  onVote?: (pollId: number, optionIds: number[]) => void;
  currentMember?: Member;
}

function PollMessage({ message, onVote, currentMember }: PollMessageRealProps) {
  const { poll, ownerMember } = message;

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("poll has been changed", poll);
    if (!poll) return;
  }, [poll]);

  // Check if current user has voted
  const hasVoted = poll?.options.some((option) => {
    return option.votedBy.some(
      (member) => member.memberId === currentMember?.memberId
    );
  });

  // Get user's current votes
  const userVotes = poll?.options
    .filter((option) =>
      option.votedBy.some(
        (member) => member.memberId === currentMember?.memberId
      )
    )
    .map((option) => option.optionId);

  // Initialize selected options with user's current votes
  useEffect(() => {
    if (hasVoted && selectedOptions.length === 0) {
      setSelectedOptions(userVotes || []);
    }
  }, [hasVoted, userVotes, selectedOptions.length]);

  const handleOptionToggle = (optionId: number) => {
    if (poll?.isClosed || hasVoted) return;

    if (poll?.isMultipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onVote?.(poll!.pollId, selectedOptions);
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total votes
  const totalVotes =
    poll?.options.reduce((sum, option) => sum + option.votedBy.length, 0) || 0;

  const getOptionPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const pollTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - pollTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const isExpired = poll?.expiredAt
    ? new Date(poll.expiredAt) < new Date()
    : false;
  const isPollActive = !poll?.isClosed && !isExpired;

  const isOptionSelected = (optionId: number) =>
    selectedOptions.includes(optionId);
  const isOptionVotedBy = (optionId: number) =>
    userVotes?.includes(optionId) || false;

  return (
    <div className="flex justify-center mb-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-[400px] min-w-[320px] shadow-sm">
        {/* Poll Header with Creator Info */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={ownerMember?.user?.avatar || "/placeholder.svg"}
              />
              <AvatarFallback className="text-xs">
                {ownerMember?.user?.fullName[0] ||
                  ownerMember?.nickName?.[0] ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {ownerMember?.nickName ||
                    ownerMember?.user?.fullName ||
                    "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">created a poll</span>
                {poll?.isClosed && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Closed
                  </span>
                )}
                {isExpired && !poll?.isClosed && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    Expired
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(message.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Poll</span>
          </div>

          {/* Poll Question from message content */}
          <h3 className="font-semibold text-lg leading-tight text-gray-900">
            {message.content || "Poll Question"}
          </h3>

          {/* Expiration warning */}
          {poll?.expiredAt && isPollActive && (
            <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
              <AlertCircle className="h-3 w-3" />
              <span>Expires {formatTimeAgo(poll.expiredAt)}</span>
            </div>
          )}
        </div>

        {/* Poll Options */}
        <div className="space-y-3 mb-4">
          {poll?.options.map((option) => {
            const percentage = getOptionPercentage(option.votedBy.length);
            const isSelected = isOptionSelected(option.optionId);
            const isVoted = isOptionVotedBy(option.optionId);
            const showResults = hasVoted || !isPollActive;

            return (
              <div key={option.optionId} className="relative">
                <button
                  onClick={() => handleOptionToggle(option.optionId)}
                  disabled={!isPollActive || hasVoted}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    showResults
                      ? isVoted
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                      : isSelected
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                  } ${
                    !isPollActive || hasVoted
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Selection indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          (showResults && isVoted) ||
                          (!showResults && isSelected)
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {((showResults && isVoted) ||
                          (!showResults && isSelected)) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>

                      {/* Option text */}
                      <span className="font-medium text-gray-900">
                        {option.text}
                      </span>
                    </div>

                    {/* Vote count and percentage */}
                    {showResults && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {percentage}%
                        </div>
                        <div className="text-xs text-gray-600">
                          {option.votedBy.length} votes
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  {showResults && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isVoted ? "bg-blue-500" : "bg-gray-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>

                {/* Show voters on hover/click */}
                {showResults && option.votedBy.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    <div className="flex -space-x-1">
                      {option.votedBy.slice(0, 3).map((member) => (
                        <Avatar
                          key={member.memberId}
                          className="w-4 h-4 border border-white"
                        >
                          <AvatarImage
                            src={member.user?.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {member.user.fullName?.[0] ||
                              member.nickName?.[0] ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {option.votedBy.length > 3 && (
                        <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                          +{option.votedBy.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vote Button */}
        {isPollActive && !hasVoted && selectedOptions.length > 0 && (
          <Button
            onClick={handleSubmitVote}
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 font-semibold mb-4"
          >
            {isSubmitting ? "Voting..." : "Vote"}
          </Button>
        )}

        {/* Poll Footer */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="font-medium">{totalVotes} votes</span>
              </div>
              {poll?.isMultipleChoice && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Multiple choices
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {poll?.isClosed ? "Poll ended" : isExpired ? "Expired" : "Active"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PollMessage);
