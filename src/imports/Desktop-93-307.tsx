function Logo() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Logo">
      <p className="css-ew64yg font-['Work_Sans:Medium',sans-serif] font-medium leading-[1.05] relative shrink-0 text-[#21214f] text-[20px] tracking-[-0.9px]">Peerly</p>
    </div>
  );
}

function Nav() {
  return (
    <nav className="bg-[#a0b8f1] h-[102px] relative shrink-0 w-full" data-name="Nav">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[40px] py-[32px] relative size-full">
          <Logo />
        </div>
      </div>
    </nav>
  );
}

function PlaceholderFrame() {
  return (
    <div className="content-stretch flex items-center justify-center p-[12px] relative rounded-[100px] shrink-0 w-[220px]" data-name="Placeholder frame">
      <div aria-hidden="true" className="absolute border-2 border-[#21214f] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] min-h-px min-w-px relative text-[#767692] text-[12px] tracking-[-0.54px]">Логин</p>
    </div>
  );
}

function LoginField() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[51.575px] shrink-0" data-name="Login field">
      <PlaceholderFrame />
    </div>
  );
}

function PlaceholderFrame1() {
  return (
    <div className="content-stretch flex items-center justify-center p-[12px] relative rounded-[100px] shrink-0 w-[220px]" data-name="Placeholder frame">
      <div aria-hidden="true" className="absolute border-2 border-[#21214f] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] min-h-px min-w-px relative text-[#767692] text-[12px] tracking-[-0.54px]">Пароль</p>
    </div>
  );
}

function Password() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[51.575px] shrink-0" data-name="Password">
      <PlaceholderFrame1 />
    </div>
  );
}

function PlaceholderFrame2() {
  return (
    <div className="content-stretch flex items-center justify-center p-[12px] relative rounded-[100px] shrink-0 w-[220px]" data-name="Placeholder frame">
      <div aria-hidden="true" className="absolute border-2 border-[#21214f] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <p className="css-4hzbpn flex-[1_0_0] font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] min-h-px min-w-px relative text-[#767692] text-[12px] tracking-[-0.54px]">Повторите пароль</p>
    </div>
  );
}

function RepeatPassword() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[51.575px] shrink-0" data-name="Repeat password">
      <PlaceholderFrame2 />
    </div>
  );
}

function SignUpButton() {
  return (
    <div className="bg-[#21214f] content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0" data-name="Sign up button">
      <p className="css-4hzbpn font-['Work_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-center text-white tracking-[-0.54px] w-[138px]">Зарегистрироваться</p>
    </div>
  );
}

function SignUp() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full" data-name="Sign-up">
      <p className="css-ew64yg font-['Work_Sans:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[1.05] relative shrink-0 text-[#21214f] text-[40px] tracking-[-1.8px]">Регистрация</p>
      <LoginField />
      <Password />
      <RepeatPassword />
      <SignUpButton />
      <p className="css-ew64yg font-['DM_Sans:Medium','Noto_Sans:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#21214f] text-[15px] tracking-[-0.3px]" style={{ fontVariationSettings: "'opsz' 14" }}>
        <span className="leading-none text-[#767692]">{`Уже есть аккаунт? `}</span>
        <span className="leading-none">Войти.</span>
      </p>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-white relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full" data-name="Hero section">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[40px] py-[100px] relative w-full">
          <SignUp />
        </div>
      </div>
    </section>
  );
}

function Main() {
  return (
    <main className="content-stretch flex flex-col items-start p-0 relative shrink-0 w-full" data-name="Main" tabIndex="-1">
      <HeroSection />
    </main>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Desktop">
      <Nav />
      <Main />
    </div>
  );
}