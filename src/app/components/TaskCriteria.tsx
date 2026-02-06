interface Criterion {
  name: string;
  points: number;
  description: string;
}

const criteria: Criterion[] = [
  { name: 'Качество дизайна', points: 25, description: 'Визуальная целостность, следование принципам дизайна' },
  { name: 'Функциональность', points: 25, description: 'Полнота реализации требуемых экранов и функций' },
  { name: 'UX проработка', points: 20, description: 'Удобство использования, логичность навигации' },
  { name: 'Адаптивность', points: 15, description: 'Корректное отображение на разных устройствах' },
  { name: 'Презентация', points: 15, description: 'Качество презентации и защиты проекта' }
];

export function TaskCriteria() {
  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);
  
  return (
    <div className="bg-[#f9f9f9] rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-[#21214f] mb-4">
        Критерии оценки
      </h2>
      
      <div className="overflow-x-auto rounded-[12px] border border-[#c7c7c7]">
        <table className="w-full">
          <thead className="bg-[#e4e4e4]">
            <tr>
              <th className="text-left p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
                Критерий
              </th>
              <th className="text-center p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f] w-20 desktop:w-24">
                Баллы
              </th>
              <th className="text-left p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f] hidden tablet:table-cell">
                Описание
              </th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, index) => (
              <tr key={index} className="border-t border-[#c7c7c7] hover:bg-[#f2f2f2] transition-colors">
                <td className="p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
                  {criterion.name}
                </td>
                <td className="p-2 desktop:p-3 text-center text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
                  {criterion.points}
                </td>
                <td className="p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] hidden tablet:table-cell">
                  {criterion.description}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#21214f] bg-[#e4e4e4]">
              <td className="p-2 desktop:p-3 text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
                Итого
              </td>
              <td className="p-2 desktop:p-3 text-center text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
                {totalPoints}
              </td>
              <td className="p-2 desktop:p-3 hidden tablet:table-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}