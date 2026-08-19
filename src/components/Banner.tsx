import BackgroundImage from '@/assets/background-home.jpg'

export default function Banner() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <img
        src={BackgroundImage}
        alt="Banner do login"
        className="object-cover w-full h-full"
      />

      {/* <Image
                src={BannerForms}
                alt="Banner do login"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
            /> */}
    </div>
  )
}
