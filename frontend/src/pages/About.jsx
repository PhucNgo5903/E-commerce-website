import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets'
const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Forever is not just a clothing store; it's a destination for fashion enthusiasts who seek quality, variety, and convenience. Founded with the vision of making stylish clothing accessible to everyone, we offer a wide range of apparel for men, women, and kids. Our collections are carefully curated to reflect the latest trends, while maintaining the classic pieces that never go out of style.</p>
              <p>With an intuitive shopping experience, whether you're browsing the latest collections or finalizing an order, we ensure that every step is seamless and enjoyable.</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectation, from browsing and ordering to delivery and beyond. </p>
          </div>
      </div>

      <div className='text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>At Forever, we are committed to delivering high-quality products that meet your expectations. Our team meticulously selects materials and rigorously tests every item to ensure durability and comfort, providing you with the best shopping experience possible.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className='text-gray-600'>We prioritize your convenience by offering a seamless online shopping experience. With easy navigation, quick checkout, and multiple payment options, shopping with us is designed to fit your busy lifestyle. Enjoy hassle-free delivery right to your doorstep.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Our dedicated customer service team is here to assist you every step of the way. Whether you have questions about your order or need help with sizing, we are committed to providing prompt and friendly support to ensure your complete satisfaction.</p>
          </div>

      </div>

      <NewsletterBox />
    </div>
  )
}

export default About
