import { Member } from "@/types/member.model";
import { useNavigate } from "react-router";

const MentionComponent = ({ data }: { data: Member }) => {
  const navigate = useNavigate();

  return (
    <span
      onClick={() => {
        navigate(`/u/profile/${data.user?.userName}`);
      }}
      className="inline  text-blue-600 px-1 py-0.5 rounded font-medium hover:bg-blue-200 cursor-pointer transition-colors"
    >
      @{data.nickName}
    </span>
  );
};

const parseTemplate = (template: string, mentionData: Member[]) => {
  const parts: React.ReactNode[] = [];
  const mentionRegex = /\{\{@\}\}/g;
  let lastIndex = 0;
  let match;
  let mentionIndex = 0;

  while ((match = mentionRegex.exec(template)) !== null) {
    // Thêm text trước mention
    if (match.index > lastIndex) {
      const textPart = template.slice(lastIndex, match.index);
      if (textPart) parts.push(textPart);
    }

    // Thêm mention component nếu còn data
    if (mentionIndex < mentionData.length) {
      parts.push(
        <MentionComponent
          key={`mention-${mentionIndex}`}
          data={mentionData[mentionIndex]}
        />
      );
      mentionIndex++;
    } else {
      parts.push("{{@}}");
    }

    lastIndex = match.index + match[0].length;
  }

  // Thêm text còn lại
  if (lastIndex < template.length) {
    const remainingText = template.slice(lastIndex);
    if (remainingText) parts.push(remainingText);
  }

  return parts;
};

// Component đơn giản như Messenger
const TemplateMessage = ({
  template,
  mentions,
}: {
  template: string;
  mentions: Member[];
}) => {
  return (
    <div className="rounded-2xl px-3 py-2 max-w-fit">
      <span className="text-gray-900 text-sm">
        {parseTemplate(template, mentions)}
      </span>
    </div>
  );
};

export default TemplateMessage;
