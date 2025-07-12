import React, { useEffect, useState } from 'react';

const images = [
    'shagunicon.png',
    'https://picsum.photos/id/1012/800/600',
    'https://picsum.photos/id/1015/800/600',
    'shagunicon.png',
    'https://picsum.photos/id/1020/800/600',
    'https://picsum.photos/id/1021/800/600',
];

const ImageSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % images.length
            );
        }, 2000); // change image every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    const getIndices = () => {
        const prev = (currentIndex - 1 + images.length) % images.length;
        const next = (currentIndex + 1) % images.length;
        return [prev, currentIndex, next];
    };

    const [left, center, right] = getIndices();

    return (
        <div className="w-full flex justify-center items-center overflow-hidden py-8 bg-gray-900">
            <div className="flex gap-4 md:gap-8 lg:gap-12 transition-all duration-500">
                {[left, center, right].map((index, i) => {
                    const isCenter = index === center;
                    return (
                        <div
                            key={index}
                            className={`relative transition-all duration-500 rounded-lg overflow-hidden 
                ${isCenter ? 'scale-150 z-10' : 'scale-100 opacity-60'}
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
        </div>
    );
};

export default ImageSlider;
