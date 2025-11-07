const MainTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center gap-3 md:gap-4 lg:gap-[16px] flex flex-col items-center justify-center px-4">
      <p className="text-2xl md:text-3xl lg:text-[36px] font-arimo text-[#0A0A0A]">{title}</p>
      <p className="text-base md:text-lg lg:text-[20px] text-[#717182]">{subtitle}</p>
    </div>
  )
};

export default MainTitle;