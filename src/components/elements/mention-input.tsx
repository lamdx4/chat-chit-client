import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Member } from "@/types/member.model";

interface Mention {
  id: string;
  memberId: number;
  nickName: string;
  fullName: string;
  start: number;
  end: number;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string, mentions: Mention[]) => void;
  onSubmit?: (value: string, mentions: Mention[]) => void;
  onSearchMembers: (query: string) => Promise<Member[]>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  onSubmit,
  onSearchMembers = async () => [],
  placeholder = "Type a message...",
  className,
  disabled = false,
}) => {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionUsers, setSuggestionUsers] = useState<Member[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Parse text to find mentions
  const parseMentions = useCallback((text: string): Mention[] => {
    const mentionRegex = /@(\w+)/g;
    const foundMentions: Mention[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      foundMentions.push({
        id: `${username}-${match.index}`,
        memberId: 1, // note
        nickName: username,
        fullName: username,
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return foundMentions;
  }, []);

  // Render highlighted text
  const renderHighlightedText = useCallback(() => {
    if (mentions.length === 0) return value;

    let result = "";
    let lastIndex = 0;

    mentions.forEach((mention) => {
      // Add text before mention
      result += value.substring(lastIndex, mention.start);

      // Add highlighted mention
      result += `<span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 6px; font-weight: 500;">@${mention.nickName}</span>`;

      lastIndex = mention.end;
    });

    // Add remaining text
    result += value.substring(lastIndex);

    return result;
  }, [value, mentions]);

  // Sync scroll between input and highlight layer
  const syncScroll = () => {
    if (inputRef.current && highlightRef.current) {
      highlightRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  // Handle text change
  const handleTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    // Check if we're typing a mention
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1];
      const start = cursorPosition - mentionMatch[0].length;

      setMentionQuery(query);
      setMentionStart(start);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(0);

      // Search for members
      if (
        query.length >= 1 &&
        onSearchMembers &&
        typeof onSearchMembers === "function"
      ) {
        setIsSearching(true);
        try {
          const users = await onSearchMembers(query);
          setSuggestionUsers(users || []);
        } catch (error) {
          console.error("Error searching members:", error);
          setSuggestionUsers([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestionUsers([]);
      }
    } else {
      setShowSuggestions(false);
      setMentionQuery("");
    }

    // Parse mentions and update state
    const newMentions = parseMentions(newValue);
    setMentions(newMentions);
    onChange(newValue, newMentions);
  };

  // Handle mention selection
  const selectMention = (member: Member) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const beforeMention = value.substring(0, mentionStart);
    const afterMention = value.substring(input.selectionStart || 0);
    const mentionText = `@${member.user.userName}`;

    const newValue = beforeMention + mentionText + afterMention;
    const newCursorPosition = mentionStart + mentionText.length;

    // Create the mention object
    const newMention: Mention = {
      id: `${member.memberId}-${mentionStart}`,
      memberId: member.memberId,
      nickName: member.nickName,
      fullName: member.user.fullName,
      start: mentionStart,
      end: mentionStart + mentionText.length,
    };

    // Update mentions
    const updatedMentions = [...mentions, newMention];
    setMentions(updatedMentions);
    onChange(newValue, updatedMentions);

    setShowSuggestions(false);
    setMentionQuery("");

    // Set cursor position after mention
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestionUsers.length > 0) {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : suggestionUsers.length - 1
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedSuggestionIndex((prev) =>
            prev < suggestionUsers.length - 1 ? prev + 1 : 0
          );
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          if (suggestionUsers[selectedSuggestionIndex]) {
            selectMention(suggestionUsers[selectedSuggestionIndex]);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          break;
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSubmit?.(value, mentions);
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (suggestionsRef.current && showSuggestions) {
      const selectedElement = suggestionsRef.current.children[
        selectedSuggestionIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedSuggestionIndex, showSuggestions]);

  return (
    <div className={cn("relative", className)}>
      {/* Input container */}
      <div className="relative">
        {/* Highlight layer - shows behind the input */}
        <div
          ref={highlightRef}
          className="absolute inset-0 px-3 py-2 pointer-events-none whitespace-nowrap overflow-hidden rounded-full text-sm border-0 flex items-center"
          style={{
            color: "transparent",
            backgroundColor: "transparent",
            font: "inherit",
            lineHeight: "inherit",
            height: "40px",
          }}
          dangerouslySetInnerHTML={{ __html: renderHighlightedText() }}
        />

        {/* Actual input - transparent text when mentions exist */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 h-10 border-0 rounded-full bg-[#F3F3F5] focus:bg-gray-100",
            "focus:outline-none focus:ring-0",
            "relative z-10 text-sm",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            color: mentions.length > 0 ? "transparent" : "inherit",
            backgroundColor: mentions.length > 0 ? "transparent" : undefined,
          }}
        />
      </div>

      {/* Mention suggestions */}
      {showSuggestions && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <ScrollArea className="max-h-64" ref={suggestionsRef}>
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1 font-medium flex items-center gap-2">
                People
                {isSearching && <Loader2 className="h-3 w-3 animate-spin" />}
              </div>

              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              ) : suggestionUsers.length > 0 ? (
                suggestionUsers.map((member, index) => (
                  <div
                    key={member.memberId}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                      index === selectedSuggestionIndex
                        ? "bg-blue-50 text-blue-900"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => selectMention(member)}
                  >
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={member.user.avatar || "/placeholder.svg"}
                          alt={member.user.fullName || member.user.userName}
                        />
                        <AvatarFallback className="text-xs">
                          {member.user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs truncate">
                        {member.user.fullName}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        @{member.user.userName}
                      </div>
                    </div>
                    {index === selectedSuggestionIndex && (
                      <div className="text-blue-500 text-xs">↵</div>
                    )}
                  </div>
                ))
              ) : (
                mentionQuery && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No members found for "{mentionQuery}"
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
