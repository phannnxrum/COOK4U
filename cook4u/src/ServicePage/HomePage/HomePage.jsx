import HeaderClient from '../../Client/HeaderClient'
import FavoriteDishSection from './FavoriteDishSection'
import InstructionSection from './InstructionSection'
import CustomerSection from './CustomerSection'
import Cook4USection from './Cook4USection'
import Footer from '../../User/Footer'
import CarouselClient from '../../Client/CarouselClient'

const HomePage = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center gap-[48px]'>
      <HeaderClient />
      <CarouselClient />
      <FavoriteDishSection />
      <InstructionSection />
      <CustomerSection />
      <Cook4USection />
      <Footer />
    </div>
  )
}
export default HomePage