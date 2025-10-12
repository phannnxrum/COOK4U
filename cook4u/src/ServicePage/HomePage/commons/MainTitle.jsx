const MainTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center gap-[16px] flex flex-col items-center justify-center">
      <p className="text-[36px] font-arimo text-[#0A0A0A]">{title}</p>
      <p className="text-[20px] text-[#717182]">{subtitle}</p>
    </div>
  )
};

export default MainTitle;