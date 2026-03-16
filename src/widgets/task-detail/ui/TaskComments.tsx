import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Comment {
  author: string;
  text: string;
  date: string;
  isTeacher: boolean;
}

export function TaskComments() {
  const { t } = useTranslation();

  const [comments, setComments] = useState<Comment[]>([
    {
      author: t("widget.taskComments.teacher"),
      text: t("widget.taskComments.mockComment1"),
      date: t("widget.taskComments.mockDate1"),
      isTeacher: true,
    },
    {
      author: t("widget.taskComments.you"),
      text: t("widget.taskComments.mockComment2"),
      date: t("widget.taskComments.mockDate2"),
      isTeacher: false,
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          author: t("widget.taskComments.you"),
          text: newComment,
          date: new Date().toLocaleString(undefined, {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isTeacher: false,
        },
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="bg-[#f9f9f9] rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-[#21214f] mb-4">
        {t("widget.taskComments.title")}
      </h2>

      <div className="space-y-3 desktop:space-y-4 mb-4 desktop:mb-6">
        {comments.map((comment, index) => (
          <div
            key={index}
            className={`p-3 desktop:p-4 rounded-[12px] ${comment.isTeacher ? "bg-[#d2def8]" : "bg-white border border-[#c7c7c7]"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
                {comment.author}
              </span>
              <span className="text-[12px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.42px] text-[#767692]">
                {comment.date}
              </span>
            </div>
            <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] leading-[1.4]">
              {comment.text}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t("widget.taskComments.placeholder")}
          className="flex-1 px-3 desktop:px-4 py-2 desktop:py-3 rounded-[12px] bg-white border border-[#c7c7c7] text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f] placeholder:text-[#767692] focus:outline-none focus:border-[#b7bdff]"
        />
        <button
          type="submit"
          className="bg-[#d2def8] hover:bg-[#b7bdff] transition-colors px-3 desktop:px-4 py-2 desktop:py-3 rounded-[12px] flex items-center justify-center"
        >
          <Send className="size-5 text-[#21214f]" />
        </button>
      </form>
    </div>
  );
}
