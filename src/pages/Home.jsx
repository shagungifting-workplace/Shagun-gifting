import React from 'react';
import { IoRocketOutline, IoGiftOutline } from "react-icons/io5";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { LuSmartphone, LuQrCode, LuShield } from "react-icons/lu";
import { Link } from "react-router-dom";

// ImageSlider component
const images = [
  'https://picsum.photos/id/1011/800/600',
  'https://picsum.photos/id/1012/800/600',
  'https://picsum.photos/id/1015/800/600',
  'https://picsum.photos/id/1016/800/600',
  'https://picsum.photos/id/1020/800/600',
  'https://picsum.photos/id/1021/800/600',
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getIndices = () => {
    const prev = (currentIndex - 1 + images.length) % images.length;
    const next = (currentIndex + 1) % images.length;
    return [prev, currentIndex, next];
  };

  const [left, center, right] = getIndices();

  return (
      <div className="flex gap-4 md:gap-8 lg:gap-12 transition-all duration-500 w-screen">
        {[left, center, right].map((index, i) => {
          const isCenter = index === center;
          return (
              <div
                  key={index}
                  className={`relative transition-all duration-500 rounded-lg overflow-hidden 
              ${isCenter ? 'scale-125 z-10' : 'scale-100 opacity-50'}
             w-[150px] sm:w-[220px] md:w-[280px] lg:w-[320px] xl:w-[360px]

            `}
              >
                <img
                    src={images[index]}
                    alt={`Slide ${index}`}
                    className="w-full h-auto object-cover rounded-lg"
                />
              </div>
          );
        })}
      </div>
  );
};

const Home = () => {
  return (
      <div className="text-center" id="home">
        {/* Hero Section */}
        <section className="px-6 py-24 bg-[#fef3eb]">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#e54d26]">
            Modernize Traditional <br /> Indian Gifting
          </h1>
          <p className="text-[#4b5563] max-w-2xl mx-auto mb-8 md:text-xl">
            Transform envelope gifting at weddings and celebrations with our IoT-enabled vending machines.
            Secure, traceable, and convenient.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <ul>
              <li>
                <Link to="/mobile_ver">
                  <button className="flex items-center gap-2 border border-[#fa541c] py-2 px-6 rounded-lg bg-white text-[#a44b2e] hover:bg-gray-100">
                    <IoGiftOutline />
                    Register as Host
                  </button>
                </Link>
              </li>
            </ul>
          </div>


          {/*/!*Ready for MVP Teasting*!/*/}
          {/*<div className="max-w-4xl text-center py-6 px-8 mt-10 bg-[#ecfdf5] rounded-xl border border-green-400 mx-auto">*/}


          {/*  /!*<h3 className="flex justify-center items-center gap-2 text-xl text-green-800 font-semibold mb-2">*!/*/}
          {/*  /!*  <IoMdCheckmarkCircleOutline />*!/*/}
          {/*  /!*  Ready for MVP Testing*!/*/}
          {/*  /!*</h3>*!/*/}
          {/*  /!*<p className="text-green-700 mb-4">*!/*/}
          {/*  /!*  Test the complete flow without IoT hardware. Validate your concept with real user feedback.*!/*/}
          {/*  /!*</p>*!/*/}


          {/*  /!*<ul><li><Link to="/mvp_demo">*!/*/}
          {/*  /!*<button className="text-white bg-green-600 px-4 py-2 font-medium rounded-lg hover:bg-green-700">*!/*/}
          {/*  /!*  Start Testing →*!/*/}
          {/*  /!*</button>*!/*/}
          {/*  /!*</Link></li></ul>*!/*/}


          {/*</div>*/}





          {/* Image Slider Section */}
          <div className="max-w-6xl mx-auto mt-16">
            {/*<h3 className="text-2xl font-semibold mb-6 text-orange-700">What It Looks Like</h3>*/}
            <div className="w-full flex justify-center items-center overflow-hidden shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer p-9 rounded-xl ">
              <ImageSlider />
            </div>
          </div>
        </section>





        {/* Why Choose Shagun Section */}
        <section className="bg-[#fcf9f9] py-24 px-6">
          <h3 className="text-4xl font-bold mb-6 text-center text-black">Why Choose Shagun?</h3>
          <p className="text-gray-700 text-xl max-w-2xl mx-auto mb-12 text-center">
            Combining traditional values with modern technology for seamless gifting experiences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            <div className="border border-orange-300 bg-white p-8 rounded-xl max-w-md w-full mx-auto text-left transform transition duration-500 hover:scale-125 hover:shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer">
              <LuSmartphone className="text-orange-600 text-5xl mb-4 bg-orange-100 px-1 py-1 rounded-xl" />
              <h4 className="font-semibold text-xl mb-2">Mobile-First Design</h4>
              <p className="text-gray-600">
                Easy registration and management through our mobile-optimized platform. No complex setups required.
              </p>
            </div>
            <div className="border border-orange-300 bg-white  p-8 rounded-xl max-w-md w-full mx-auto text-left transform transition duration-500 hover:scale-125 hover:shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer">
              <LuQrCode className="text-red-700 bg-pink-200 px-1 py-1 rounded-xl text-5xl mb-4" />
              <h4 className="font-semibold text-xl mb-2">QR Code Payments</h4>
              <p className="text-gray-600">
                Guests scan QR codes to make payments directly to your UPI account. Instant, secure, and traceable.
              </p>
            </div>
            <div className="border border-orange-300 bg-white p-8 rounded-xl max-w-md w-full mx-auto text-left transform transition duration-500 hover:scale-125 hover:shadow-[0_10px_20px_rgba(245,101,39,0.3)] cursor-pointer">
              <LuShield className="text-yellow-600 text-5xl bg-yellow-200 px-1 py-2 rounded-xl mb-4" />
              <h4 className="font-semibold text-xl mb-2">Secure & Reliable</h4>
              <p className="text-gray-600">
                Bank-grade security with real-time monitoring. Your money and data are always protected.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-orange-400 to-red-600 text-white pt-16 pb-20 px-6">
          <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Event?</h3>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Join thousands of hosts who trust Shagun for their special occasions.
          </p>
          <div className="flex justify-center mt-6">
            <Link to="/mobile_ver">
              <button className="flex items-center gap-2 bg-white text-orange-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">
                Get Started Today <IoIosArrowForward />
              </button>
            </Link>
          </div>
        </section>
      </div>
  );
};

export default Home;
