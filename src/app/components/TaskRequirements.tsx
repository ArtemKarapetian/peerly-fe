import { Check } from 'lucide-react';

export function TaskRequirements() {
  const requirements = [
    'Работа должна быть выполнена самостоятельно',
    'Объём работы: не менее 1500 слов',
    'Обязательно указывайте источники',
    'Файл должен быть в формате PDF или DOCX',
    'Соблюдайте требования к оформлению'
  ];

  return (
    <div className="bg-[#f9f9f9] rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-[#21214f] mb-4">
        Требования
      </h2>
      
      <div className="space-y-3">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="size-5 rounded-full bg-[#d2def8] flex items-center justify-center">
                <Check className="size-3.5 text-[#21214f]" />
              </div>
            </div>
            <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] leading-[1.5]">
              {requirement}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
