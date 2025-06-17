import { Member } from "@/types/member.model";

const MentionComponent = ({ data }: { data: Member }) => {

  return (
    <span
      onClick={() => {
      }}
      className="inline py-0.5 rounded font-medium cursor-pointer transition-colors"
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

export default parseTemplate;
