import Image from 'next/image';

export function BackgroundFirst() {
    return (
        <div className='relative'>
            <Image
                src='/heroBg.jpg'
                alt='Hero Background'
                width={1920}
                height={1080}
            />
            <div className='absolute inset-0 bg-black opacity-60' />
        </div>
    );
}
export function BackgroundSecond() {
    return (
        <div className='relative'>
            <Image
                src='/backgroundSecond.jpg'
                alt='Dark Background'
                width={1920}
                height={1080}
            />
            <div className='absolute inset-0 bg-black opacity-60' />
        </div>
    );
}