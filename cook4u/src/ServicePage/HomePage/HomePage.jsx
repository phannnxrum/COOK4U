import HeaderClient from '../../Client/HeaderClient'
import HeroSection from './HeroSection'
import FavoriteDishSection from './FavoriteDishSection'
import InstructionSection from './InstructionSection'
import CustomerSection from './CustomerSection'
import Cook4USection from './Cook4USection'
import Footer from '../../User/Footer'

const HomePage = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center gap-[48px]'>
      <HeaderClient />
      <HeroSection />
      <FavoriteDishSection />
      <InstructionSection />
      <CustomerSection />
      <Cook4USection />
      <Footer />
    </div>
  )
}
export default HomePage