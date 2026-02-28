import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export function TaskQuestionsComments() {
  const [comment, setComment] = useState("");

  const comments = [
    {
      author: "Преподаватель",
      text: "Обратите внимание на критерии оценивания",
      date: "18 января, 15:30",
    },
    {
      author: "Студент",
      text: "Можно ли использовать дополнительные источники?",
      date: "17 января, 10:20",
    },
  ];

  return (
    <div className="bg-[#f9f9f9] rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="size-5 text-[#21214f]" />
        <h2 className="text-[18px] desktop:text-[20px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.72px] text-[#21214f]">
          Комментарии и вопросы
        </h2>
      </div>

      {/* Comments list */}
      <div className="space-y-3 mb-4">
        {comments.map((item, index) => (
          <div key={index} className="bg-white rounded-[12px] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f]">
                {item.author}
              </span>
              <span className="text-[11px] desktop:text-[12px] font-['Work_Sans:Regular',sans-serif] text-[#767692]">
                {item.date}
              </span>
            </div>
            <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.42px] text-[#4b4963] leading-[1.5]">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Add comment */}
      <div className="flex flex-col gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Задайте вопрос преподавателю..."
          rows={3}
          className="w-full px-3 py-2 bg-white border border-[#c7c7c7] rounded-[8px] text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] placeholder:text-[#767692] focus:outline-none focus:border-[#b7bdff] resize-none"
        />
        <button className="flex items-center justify-center gap-2 bg-[#d2def8] hover:bg-[#b7bdff] transition-colors px-4 py-2 rounded-[8px] text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#21214f]">
          <Send className="size-4" />
          Отправить
        </button>
      </div>
    </div>
  );
}
