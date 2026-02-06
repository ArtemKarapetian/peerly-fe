import imgImage from "@/assets/1316612187f4274840308d8544bb1f10cdcc9818.png";
import imgImage1 from "@/assets/eb9aaf49f5066472e938555cd5aa00e6418c7a26.png";
import imgImage2 from "@/assets/7177166acba64f35340faa0b6f56005880826629.png";
import imgImage3 from "@/assets/8a7431ce52feae07a5df11170b187a4a3d8ac9c2.png";

function Logo() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Logo">
      <p className="css-ew64yg font-['Work_Sans:Medium',sans-serif] font-medium leading-[1.05] relative shrink-0 text-[#21214f] text-[20px] tracking-[-0.9px]">Peerly</p>
    </div>
  );
}

function ButtonOnDark() {
  return (
    <div className="bg-[#21214f] content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0" data-name="Button on dark">
      <p className="css-ew64yg font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-white tracking-[-0.54px]">Начать peer-review</p>
    </div>
  );
}

function NavLabels() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center justify-end min-h-px min-w-px relative" data-name="Nav labels">
      <p className="css-ew64yg font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#21214f] text-[12px] tracking-[-0.54px]">Наш сервис</p>
      <ButtonOnDark />
    </div>
  );
}

function Nav() {
  return (
    <nav className="bg-[#a0b8f1] h-[102px] relative shrink-0 w-full" data-name="Nav">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[40px] py-[32px] relative size-full">
          <Logo />
          <NavLabels />
        </div>
      </div>
    </nav>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[24px] items-start relative shrink-0 text-[#21214f] w-full" data-name="Text">
      <h1 className="block css-4hzbpn leading-none relative shrink-0 text-[80px] tracking-[-4.8px] w-[543px]">Peer-review без хаоса</h1>
      <p className="css-4hzbpn leading-[1.1] min-w-full relative shrink-0 text-[16px] tracking-[-0.72px] w-[min-content]">Взаимопроверка заданий студентов, сдачи, рубрики, отчеты – в одном месте.</p>
    </div>
  );
}

function ButtonOnDark1() {
  return (
    <div className="bg-[#21214f] content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0" data-name="Button on dark">
      <p className="css-ew64yg font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-white tracking-[-0.54px]">Начать peer-review</p>
    </div>
  );
}

function Block() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[50px] items-start min-h-px min-w-px relative" data-name="Block">
      <Text />
      <ButtonOnDark1 />
    </div>
  );
}

function Image() {
  return (
    <div className="h-[411.495px] relative shrink-0 w-[429.005px]" data-name="Image">
      <img alt="Globe graphic" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex gap-[80px] items-center max-w-[1500px] relative shrink-0 w-full" data-name="Content">
      <Block />
      <Image />
    </div>
  );
}

function HeroSection() {
  return (
    <header className="bg-[#a0b8f1] relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full" data-name="Hero section">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center px-[40px] py-[100px] relative w-full">
          <Content />
        </div>
      </div>
    </header>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-col gap-[28.036px] items-center justify-center relative shrink-0 text-[#21214f] w-full" data-name="Content">
      <h2 className="block css-ew64yg font-['DM_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-none relative shrink-0 text-[15px] tracking-[-0.3px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Сервис
      </h2>
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[60px] text-center tracking-[-4.2px] w-[857.438px]">Peerly – новый игрок в взаимной проверке заданий</p>
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.1] min-w-full relative shrink-0 text-[16px] text-center tracking-[-0.72px] w-[min-content]">Подробнее расскажем о наших преимуществах</p>
    </div>
  );
}

function IntroSection() {
  return (
    <div className="max-w-[1500px] relative shrink-0 w-full" data-name="Intro section">
      <div className="flex flex-col items-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center max-w-[inherit] pb-[100px] pt-[120px] px-[40px] relative w-full">
          <Content1 />
        </div>
      </div>
    </div>
  );
}

function Image1() {
  return (
    <div className="aspect-[460/333.8385009765625] flex-[1_0_0] min-h-px min-w-px relative" data-name="Image">
      <img alt="Coins coming out of phone" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[40px] items-start relative shrink-0 text-[#21214f] w-full" data-name="Text">
      <h3 className="block css-4hzbpn leading-[1.05] relative shrink-0 text-[40px] tracking-[-1.8px] w-full">Самостоятельная платформа</h3>
      <p className="css-4hzbpn leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-full">На базе Peerly можно загрузить, запустить, провести, закончить и выгрузить отчет по заданию. Также функционал можно подключить как плагин к разным LMS.</p>
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Content">
      <Text1 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#d2e1f8] content-stretch flex gap-[70px] items-center pl-[80px] pr-[100px] py-[80px] relative rounded-[20px] shrink-0 w-[1036px]" data-name="Card">
      <Image1 />
      <Content2 />
    </div>
  );
}

function Section() {
  return (
    <div className="max-w-[1500px] relative shrink-0 w-full" data-name="Section 1">
      <div className="content-stretch flex items-start justify-between max-w-[inherit] pl-[20px] pr-0 py-[20px] relative w-full">
        <Card />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[40px] items-start relative shrink-0 text-[#21214f] w-full" data-name="Text">
      <h3 className="block css-4hzbpn leading-[1.05] relative shrink-0 text-[40px] tracking-[-1.8px] w-full">Снижение нагрузки на преподавателя</h3>
      <p className="css-4hzbpn leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-full">Взаимопроверка студентов развивает практические навыки у учащихся и снижает нагрузку у преподавателя, не нуждающемуся в индивидуальной проверке каждого решения.</p>
    </div>
  );
}

function Content3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Content">
      <Text2 />
    </div>
  );
}

function Image2() {
  return (
    <div className="aspect-[524/344.3775634765625] flex-[1_0_0] min-h-px min-w-px relative" data-name="Image">
      <img alt="Bar and pie chart" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-[#d2e1f8] content-stretch flex gap-[70px] items-center justify-end p-[80px] relative rounded-[20px] shrink-0 w-[1044px]" data-name="Card">
      <Content3 />
      <Image2 />
    </div>
  );
}

function Section1() {
  return (
    <div className="max-w-[1500px] relative shrink-0 w-full" data-name="Section 2">
      <div className="flex flex-row justify-end max-w-[inherit] size-full">
        <div className="content-stretch flex items-start justify-end max-w-[inherit] pl-0 pr-[20px] py-[20px] relative w-full">
          <Card1 />
        </div>
      </div>
    </div>
  );
}

function Image3() {
  return (
    <div className="h-[319.194px] relative shrink-0 w-[380.43px]" data-name="Image">
      <img alt="Safe box" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex flex-col font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[40px] items-start relative shrink-0 text-[#21214f] w-full" data-name="Text">
      <h3 className="block css-4hzbpn leading-[1.05] relative shrink-0 text-[40px] tracking-[-1.8px] w-full">Гибкая настройка заданий</h3>
      <p className="css-4hzbpn leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-full">Переназначение проверяющих, контроль рецензентов, настройка анонимности и другие функции – на пользу учителю и студентам.</p>
    </div>
  );
}

function Content4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Content">
      <Text3 />
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-[#d2e1f8] content-stretch flex gap-[70px] items-center p-[80px] relative rounded-[20px] shrink-0 w-[1020px]" data-name="Card">
      <Image3 />
      <Content4 />
    </div>
  );
}

function Section2() {
  return (
    <div className="max-w-[1500px] relative shrink-0 w-full" data-name="Section 3">
      <div className="content-stretch flex items-start max-w-[inherit] pl-[20px] pr-0 py-[20px] relative w-full">
        <Card2 />
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <div className="bg-[#f9f9f9] content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Services section">
      <IntroSection />
      <Section />
      <Section1 />
      <Section2 />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[50px] items-start justify-center relative shrink-0 text-[#21214f] w-full" data-name="Header">
      <h2 className="block css-4hzbpn flex-[1_0_0] leading-[1.05] min-h-px min-w-px relative text-[60px] tracking-[-4.2px]">Деление на роли внутри платформы</h2>
      <p className="css-4hzbpn flex-[1_0_0] leading-[1.1] min-h-px min-w-px relative text-[16px] tracking-[-0.72px]">В Peerly пользователи поделены на три основные группы, каждые из которых имеют собственный набор возможных действий.</p>
    </div>
  );
}

function CallOut() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Call-out 1">
      <div aria-hidden="true" className="absolute border-[#26214f] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[30px] items-start pl-[50px] pr-[80px] py-[20px] relative size-full text-[#21214f]">
        <h3 className="block css-4hzbpn leading-[1.05] min-w-full relative shrink-0 text-[30px] tracking-[-1.35px] w-[min-content]">Студенты</h3>
        <p className="css-4hzbpn leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-[236.252px]">Простота и многозадачность</p>
        <p className="css-4hzbpn leading-[1.1] min-w-full relative shrink-0 text-[16px] tracking-[-0.72px] w-[min-content]">Дизайн приложения сделан с расчетом на наличие несколько подряд идущих заданий по разным предметам с разным статусом и неодинаковыми формами сдачи.</p>
      </div>
    </div>
  );
}

function CallOut1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Call-out 2">
      <div aria-hidden="true" className="absolute border-[#26214f] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[30px] items-start pl-[50px] pr-0 py-[20px] relative size-full text-[#21214f]">
        <h3 className="block css-4hzbpn leading-[1.05] min-w-full relative shrink-0 text-[30px] tracking-[-1.35px] w-[min-content]">Преподаватели</h3>
        <p className="css-4hzbpn leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-[144.604px]">Ясность</p>
        <p className="css-4hzbpn leading-[1.1] min-w-full relative shrink-0 text-[16px] tracking-[-0.72px] w-[min-content]">Интерфейс для преподавателя позволяет настраивать, отслеживать и выгружать задания, контролировать действия конкретных студентов.</p>
      </div>
    </div>
  );
}

function CallOut2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Call-out 3">
      <div aria-hidden="true" className="absolute border-[#26214f] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal gap-[30px] items-start pl-[50px] pr-[80px] py-[20px] relative size-full text-[#21214f]">
        <h3 className="block css-4hzbpn leading-[1.05] min-w-full relative shrink-0 text-[30px] tracking-[-1.35px] w-[min-content]">Администратор</h3>
        <p className="css-4hzbpn leading-[1.1] relative shrink-0 text-[16px] tracking-[-0.72px] w-[144.604px]">Прозрачность</p>
        <p className="css-4hzbpn leading-[1.1] min-w-full relative shrink-0 text-[16px] tracking-[-0.72px] w-[min-content]">Администратор может следить за здоровьем системы и метриками.</p>
      </div>
    </div>
  );
}

function Component3Column() {
  return (
    <div className="content-stretch flex gap-[20px] h-[330px] items-start relative shrink-0 w-full" data-name="3 column">
      <CallOut />
      <CallOut1 />
      <CallOut2 />
    </div>
  );
}

function Content5() {
  return (
    <div className="content-stretch flex flex-col gap-[160px] items-start relative shrink-0 w-full" data-name="Content">
      <Header />
      <Component3Column />
    </div>
  );
}

function BenefitsSection() {
  return (
    <div className="bg-white max-w-[1600px] relative shrink-0 w-full" data-name="Benefits section">
      <div className="max-w-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start max-w-[inherit] pb-[120px] pt-[80px] px-[40px] relative w-full">
          <Content5 />
        </div>
      </div>
    </div>
  );
}

function LargeButton() {
  return (
    <div className="bg-[#21264f] content-stretch flex items-center justify-center px-[30px] py-[24px] relative rounded-[88px] shrink-0" data-name="Large Button">
      <p className="css-ew64yg font-['DM_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-none relative shrink-0 text-[15px] text-center text-white tracking-[-0.3px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        Начать peer-review
      </p>
    </div>
  );
}

function Content6() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-center max-w-[1500px] relative shrink-0 w-full" data-name="Content">
      <p className="css-4hzbpn font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] min-w-full relative shrink-0 text-[#21214f] text-[60px] text-center tracking-[-4.2px] w-[min-content]">Peerly позволит оптимизировать нагрузку на преподавателя и улучшить качество образования.</p>
      <LargeButton />
    </div>
  );
}

function ExpertsSection() {
  return (
    <div className="bg-[#f9f9f9] relative shrink-0 w-full" data-name="Experts section">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center px-[120px] py-[160px] relative w-full">
          <Content6 />
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <main className="content-stretch flex flex-col items-start p-0 relative shrink-0 w-full" data-name="Main" tabIndex="-1">
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <ExpertsSection />
    </main>
  );
}

function Logo1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Logo">
      <p className="css-ew64yg font-['Work_Sans:Medium',sans-serif] font-medium leading-[1.05] relative shrink-0 text-[30px] text-white tracking-[-1.35px]">Peerly</p>
    </div>
  );
}

function LeftColumn() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[200px] items-start min-h-px min-w-px relative" data-name="Left column">
      <Logo1 />
    </div>
  );
}

function ButtonWhite() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0" data-name="Button white">
      <p className="css-ew64yg font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#21214f] text-[12px] tracking-[-0.54px]">Начать peer-review</p>
    </div>
  );
}

function Content7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[11px] items-center min-h-px min-w-px relative" data-name="Content">
      <p className="css-ew64yg font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[#d1d0e4] text-[12px] tracking-[-0.54px]">Сервис</p>
      <ButtonWhite />
    </div>
  );
}

function Labels() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Labels">
      <Content7 />
    </div>
  );
}

function RightColumn() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[200px] items-start min-h-px min-w-px relative" data-name="Right column">
      <Labels />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#21264f] relative shrink-0 w-full" data-name="Footer">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-between px-[40px] py-[32px] relative w-full">
          <LeftColumn />
          <RightColumn />
        </div>
      </div>
    </footer>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Desktop">
      <Nav />
      <Main />
      <Footer />
    </div>
  );
}