import svgPaths from "./svg-vp0aa5bptg";
import imgEllipse1 from "@/assets/96fcb7349c6b7606f049631e7c105b9d12154852.png";

function Logo() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Logo">
      <p className="css-ew64yg font-['Work_Sans:Medium',sans-serif] font-medium leading-[1.05] relative shrink-0 text-[#21214f] text-[20px] tracking-[-0.9px]">
        Peerly
      </p>
    </div>
  );
}

function NavHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="NavHeader">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[10px] relative w-full">
          <Logo />
          <div
            className="flex items-center justify-center relative shrink-0 size-[11.314px]"
            style={
              {
                "--transform-inner-width": "0",
                "--transform-inner-height": "19",
              } as React.CSSProperties
            }
          >
            <div className="flex-none rotate-[45deg]">
              <div className="relative size-[8px]" data-name="arrow">
                <div className="absolute inset-[-18.75%]">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 11 11"
                  >
                    <path
                      d="M1.5 1.5V9.5H9.5"
                      id="arrow"
                      stroke="var(--stroke-0, #21214F)"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpperSection() {
  return (
    <div
      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
      data-name="Upper Section"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#c7c7c7] border-b-2 border-solid inset-0 pointer-events-none"
      />
      <NavHeader />
    </div>
  );
}

function Book24DpE3E3E3Fill0Wght400Grad0Opsz() {
  return (
    <div
      className="relative shrink-0 size-[19px]"
      data-name="book_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24 1"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="book_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.p2232b200} fill="var(--fill-0, #21214F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Profile() {
  return (
    <div className="bg-[#d2def8] relative rounded-[8px] shrink-0 w-full" data-name="Profile">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex gap-[8px] items-end p-[4px] relative w-full">
          <Book24DpE3E3E3Fill0Wght400Grad0Opsz />
          <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[18px] tracking-[-0.54px]">
            Курсы
          </p>
        </div>
      </div>
    </div>
  );
}

function MiddleSection() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Middle Section">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[6px] py-[10px] relative size-full">
          <Profile />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[19px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="Frame 1">
          <circle cx="9.5" cy="9.5" fill="var(--fill-0, #D7D7D7)" id="Ellipse 1" r="9.5" />
        </g>
      </svg>
    </div>
  );
}

function Profile1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Profile">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex gap-[8px] items-end p-[10px] relative w-full">
          <Frame />
          <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[18px] tracking-[-0.54px]">
            Профиль
          </p>
        </div>
      </div>
    </div>
  );
}

function BottomSection() {
  return (
    <div
      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
      data-name="Bottom Section"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#c7c7c7] border-solid border-t-2 inset-0 pointer-events-none"
      />
      <Profile1 />
    </div>
  );
}

function AllSections() {
  return (
    <div
      className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[177px]"
      data-name="All Sections"
    >
      <UpperSection />
      <MiddleSection />
      <BottomSection />
    </div>
  );
}

function NavSide() {
  return (
    <div
      className="bg-white content-stretch flex items-center relative self-stretch shrink-0 w-[180px]"
      data-name="NavSide"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#c7c7c7] border-r-3 border-solid inset-0 pointer-events-none"
      />
      <AllSections />
    </div>
  );
}

function Component() {
  return (
    <div className="bg-[#f2b2d6] h-[100px] rounded-[20px] shrink-0 w-full" data-name="Картинка" />
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[17px]">
      <div className="absolute left-0 size-[17px] top-[-0.13px]">
        <img
          alt=""
          className="block max-w-none size-full"
          height="17"
          src={imgEllipse1}
          width="17"
        />
      </div>
    </div>
  );
}

function Profile2() {
  return (
    <div
      className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full"
      data-name="Profile"
    >
      <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#4b4963] text-[16px] tracking-[-0.72px]">
        Преподаватель
      </p>
      <Frame1 />
    </div>
  );
}

function Component1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Текстовка">
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[20px] py-0 relative w-full">
        <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[40px] tracking-[-1.8px] w-full">
          Название курса
        </p>
        <Profile2 />
      </div>
    </div>
  );
}

function CourseHeader() {
  return (
    <div
      className="bg-[#f9f9f9] content-stretch flex flex-col gap-[12px] items-start justify-center max-w-[1200px] min-w-[180px] pb-[20px] pt-0 px-0 relative rounded-[20px] shrink-0 w-[800px]"
      data-name="Course header"
    >
      <Component />
      <Component1 />
    </div>
  );
}

function Component2() {
  return (
    <div
      className="content-stretch flex flex-col items-start p-[8px] relative shrink-0"
      data-name="Задания"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#21264f] border-b-2 border-solid inset-0 pointer-events-none"
      />
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#21214f] text-[16px] tracking-[-0.72px] w-full">
        Задания
      </p>
    </div>
  );
}

function Component3() {
  return (
    <div
      className="content-stretch flex flex-col items-start p-[8px] relative rounded-[12px] shrink-0"
      data-name="Участники"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#4b4963] text-[16px] tracking-[-0.72px] w-full">
        Участники
      </p>
    </div>
  );
}

function CourseContent() {
  return (
    <div className="relative shrink-0 w-full" data-name="Course content">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[20px] py-[4px] relative w-full">
          <Component2 />
          <Component3 />
        </div>
      </div>
    </div>
  );
}

function Search24DpE3E3E3Fill0Wght400Grad0Opsz() {
  return (
    <div
      className="relative shrink-0 size-[20px]"
      data-name="search_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24 1"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="search_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24 1">
          <path d={svgPaths.p378bce80} fill="var(--fill-0, #767692)" id="Vector" />
          <path d={svgPaths.p378bce80} fill="var(--fill-0, #767692)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Component5() {
  return (
    <div className="bg-[#e4e4e4] relative rounded-[12px] shrink-0 w-full" data-name="Поиск заданий">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center p-[8px] relative w-full">
          <Search24DpE3E3E3Fill0Wght400Grad0Opsz />
          <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#767692] text-[18px] tracking-[-0.81px]">
            Поиск заданий
          </p>
        </div>
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div
      className="bg-[#d2def8] content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0"
      data-name="Все"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#21214f] text-[16px] tracking-[-0.72px] w-full">
        Все
      </p>
    </div>
  );
}

function Component8() {
  return (
    <div
      className="bg-[#e4e4e4] content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0"
      data-name="Истекает срок сдачи"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#4b4963] text-[16px] tracking-[-0.72px] w-full">
        Истекает срок сдачи
      </p>
    </div>
  );
}

function Component9() {
  return (
    <div
      className="bg-[#e4e4e4] content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0"
      data-name="Завершенные"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#4b4963] text-[16px] tracking-[-0.72px] w-full">
        Завершенные
      </p>
    </div>
  );
}

function Component6() {
  return (
    <div
      className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full"
      data-name="Фильтр заданий"
    >
      <Component7 />
      <Component8 />
      <Component9 />
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Дедлайн">
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] min-h-px min-w-px relative text-[#4b4963] text-[16px] tracking-[-0.72px]">
        Дедлайн: 31 января
      </p>
    </div>
  );
}

function Component11() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-[100px] relative"
      data-name="Задание"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[18px] tracking-[-0.81px] w-full">
        Задание 1
      </p>
      <Component12 />
    </div>
  );
}

function Component13() {
  return (
    <div
      className="bg-[#b7bdff] content-stretch flex items-center p-[8px] relative rounded-[12px] shrink-0"
      data-name="Статус"
    >
      <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#21214f] text-[16px] tracking-[-0.72px]">
        Сдана работа
      </p>
    </div>
  );
}

function Component10() {
  return (
    <div
      className="content-center flex flex-wrap gap-[8px] items-center justify-between relative shrink-0 w-full"
      data-name="Текстовка"
    >
      <Component11 />
      <Component13 />
    </div>
  );
}

function Task() {
  return (
    <div
      className="max-w-[1200px] min-w-[120px] relative rounded-[20px] shrink-0 w-full"
      data-name="Task"
    >
      <div className="flex flex-col justify-center max-w-[inherit] min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center max-w-[inherit] min-w-[inherit] p-[8px] relative w-full">
          <Component10 />
        </div>
      </div>
    </div>
  );
}

function Component16() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Дедлайн">
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] min-h-px min-w-px relative text-[#4b4963] text-[16px] tracking-[-0.72px]">
        Дедлайн: 31 января
      </p>
    </div>
  );
}

function Component15() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-[100px] relative"
      data-name="Задание"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[18px] tracking-[-0.81px] w-full">
        Задание 2
      </p>
      <Component16 />
    </div>
  );
}

function Component17() {
  return (
    <div
      className="bg-[#b0e9fb] content-stretch flex items-center p-[8px] relative rounded-[12px] shrink-0"
      data-name="Статус"
    >
      <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#21214f] text-[16px] tracking-[-0.72px]">
        Взаимная проверка
      </p>
    </div>
  );
}

function Component14() {
  return (
    <div
      className="content-center flex flex-wrap gap-[8px] items-center justify-between relative shrink-0 w-full"
      data-name="Текстовка"
    >
      <Component15 />
      <Component17 />
    </div>
  );
}

function Task1() {
  return (
    <div
      className="max-w-[1200px] min-w-[120px] relative rounded-[20px] shrink-0 w-full"
      data-name="Task"
    >
      <div className="flex flex-col justify-center max-w-[inherit] min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center max-w-[inherit] min-w-[inherit] p-[8px] relative w-full">
          <Component14 />
        </div>
      </div>
    </div>
  );
}

function Component20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Дедлайн">
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] min-h-px min-w-px relative text-[#4b4963] text-[16px] tracking-[-0.72px]">
        Дедлайн: 31 января
      </p>
    </div>
  );
}

function Component19() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-[100px] relative"
      data-name="Задание"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[18px] tracking-[-0.81px] w-full">
        Задание 3
      </p>
      <Component20 />
    </div>
  );
}

function Component21() {
  return (
    <div
      className="bg-[#b7bdff] content-stretch flex items-center p-[8px] relative rounded-[12px] shrink-0"
      data-name="Статус"
    >
      <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#21214f] text-[16px] tracking-[-0.72px]">
        Проверка преподавтелем
      </p>
    </div>
  );
}

function Component18() {
  return (
    <div
      className="content-center flex flex-wrap gap-[8px] items-center justify-between relative shrink-0 w-full"
      data-name="Текстовка"
    >
      <Component19 />
      <Component21 />
    </div>
  );
}

function Task2() {
  return (
    <div
      className="max-w-[1200px] min-w-[120px] relative rounded-[20px] shrink-0 w-full"
      data-name="Task"
    >
      <div className="flex flex-col justify-center max-w-[inherit] min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center max-w-[inherit] min-w-[inherit] p-[8px] relative w-full">
          <Component18 />
        </div>
      </div>
    </div>
  );
}

function Component24() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Дедлайн">
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] min-h-px min-w-px relative text-[#4b4963] text-[16px] tracking-[-0.72px]">
        Дедлайн: 31 января
      </p>
    </div>
  );
}

function Component23() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-[100px] relative"
      data-name="Задание"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[18px] tracking-[-0.81px] w-full">
        Задание 4
      </p>
      <Component24 />
    </div>
  );
}

function Component25() {
  return (
    <div
      className="bg-[#b7bdff] content-stretch flex items-center p-[8px] relative rounded-[12px] shrink-0"
      data-name="Статус"
    >
      <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#21214f] text-[16px] tracking-[-0.72px]">
        Выставление оценок
      </p>
    </div>
  );
}

function Component22() {
  return (
    <div
      className="content-center flex flex-wrap gap-[8px] items-center justify-between relative shrink-0 w-full"
      data-name="Текстовка"
    >
      <Component23 />
      <Component25 />
    </div>
  );
}

function Task3() {
  return (
    <div
      className="max-w-[1200px] min-w-[120px] relative rounded-[20px] shrink-0 w-full"
      data-name="Task"
    >
      <div className="flex flex-col justify-center max-w-[inherit] min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center max-w-[inherit] min-w-[inherit] p-[8px] relative w-full">
          <Component22 />
        </div>
      </div>
    </div>
  );
}

function Component28() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Дедлайн">
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] min-h-px min-w-px relative text-[#4b4963] text-[16px] tracking-[-0.72px]">
        Дедлайн: 31 января
      </p>
    </div>
  );
}

function Component27() {
  return (
    <div
      className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-[100px] relative"
      data-name="Задание"
    >
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[18px] tracking-[-0.81px] w-full">
        Задание 4
      </p>
      <Component28 />
    </div>
  );
}

function Component29() {
  return (
    <div
      className="bg-[#9cf38d] content-stretch flex items-center p-[8px] relative rounded-[12px] shrink-0"
      data-name="Статус"
    >
      <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] relative shrink-0 text-[#21214f] text-[16px] tracking-[-0.72px]">
        Оценки выставлены
      </p>
    </div>
  );
}

function Component26() {
  return (
    <div
      className="content-center flex flex-wrap gap-[8px] items-center justify-between relative shrink-0 w-full"
      data-name="Текстовка"
    >
      <Component27 />
      <Component29 />
    </div>
  );
}

function Task4() {
  return (
    <div
      className="max-w-[1200px] min-w-[120px] relative rounded-[20px] shrink-0 w-full"
      data-name="Task"
    >
      <div className="flex flex-col justify-center max-w-[inherit] min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center max-w-[inherit] min-w-[inherit] p-[8px] relative w-full">
          <Component26 />
        </div>
      </div>
    </div>
  );
}

function Tasks() {
  return (
    <div
      className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0 w-full"
      data-name="Tasks"
    >
      <Task />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 760 1"
          >
            <line id="Divider" stroke="var(--stroke-0, #C7C7C7)" x2="760" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Task1 />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 760 1"
          >
            <line id="Divider" stroke="var(--stroke-0, #C7C7C7)" x2="760" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Task2 />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 760 1"
          >
            <line id="Divider" stroke="var(--stroke-0, #C7C7C7)" x2="760" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Task3 />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 760 1"
          >
            <line id="Divider" stroke="var(--stroke-0, #C7C7C7)" x2="760" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Task4 />
    </div>
  );
}

function Component4() {
  return (
    <div
      className="bg-[#f9f9f9] flex-[1_0_0] min-h-px min-w-px relative rounded-[20px]"
      data-name="Задания"
    >
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[20px] relative w-full">
        <Component5 />
        <Component6 />
        <Tasks />
      </div>
    </div>
  );
}

function CourseTasks() {
  return (
    <div
      className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full"
      data-name="Course tasks"
    >
      <Component4 />
    </div>
  );
}

function Course() {
  return (
    <div
      className="content-stretch flex flex-col gap-[8px] items-center max-w-[1120px] px-[100px] py-0 relative shrink-0 w-[1000px]"
      data-name="Course"
    >
      <CourseHeader />
      <CourseContent />
      <CourseTasks />
    </div>
  );
}

function Main() {
  return (
    <main
      className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px px-0 py-[60px] relative"
      data-name="Main"
      tabIndex={-1}
    >
      <Course />
    </main>
  );
}

export default function Desktop() {
  return (
    <div
      className="bg-white content-stretch flex items-start justify-center relative size-full"
      data-name="Desktop"
    >
      <NavSide />
      <Main />
    </div>
  );
}
