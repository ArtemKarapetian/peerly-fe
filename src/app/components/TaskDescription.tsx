export function TaskDescription() {
  return (
    <div className="bg-[#f9f9f9] rounded-[16px] p-4 desktop:p-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-[#21214f] mb-4">
        Описание задания
      </h2>
      
      <div className="space-y-4">
        <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] leading-[1.6]">
          Написать аналитическое эссе на тему "Влияние цифровых технологий на современное образование". 
          В работе необходимо проанализировать как минимум три аспекта цифровизации образования, 
          привести примеры из практики и сделать обоснованные выводы.
        </p>
        
        <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#4b4963] leading-[1.6]">
          Работа должна включать введение, основную часть с аргументацией и заключение. 
          Обязательно использование академических источников с правильным оформлением ссылок.
        </p>

        <div className="bg-[#e9f5ff] rounded-[12px] p-4 mt-4">
          <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-2">
            Структура работы
          </p>
          <ul className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963] space-y-1.5 list-disc list-inside">
            <li>Введение (10-15% объёма)</li>
            <li>Основная часть с анализом (70-80%)</li>
            <li>Заключение и выводы (10-15%)</li>
            <li>Список литературы</li>
          </ul>
        </div>
      </div>
    </div>
  );
}