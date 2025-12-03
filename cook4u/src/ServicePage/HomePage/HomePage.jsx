import HeaderClient from '../../Client/HeaderClient'
import FavoriteDishSection from './FavoriteDishSection'
import InstructionSection from './InstructionSection'
import CustomerSection from './CustomerSection'
import Cook4USection from './Cook4USection'
import Footer from '../../User/Footer'
import CarouselClient from '../../Client/CarouselClient'

const HomePage = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center gap-8 md:gap-12 lg:gap-[48px] px-4 md:px-6 lg:px-0'>
      {/* <HeaderClient /> */}
      <CarouselClient />
      <FavoriteDishSection />
      <InstructionSection />
      <CustomerSection />
      <Cook4USection />
      {/* <Footer /> */}
    </div>
  )
}
export default HomePage