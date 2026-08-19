import BackgroundImage from '@/assets/background-home.jpg'

export default function Banner() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <img
        src={BackgroundImage}
        alt="Banner do login"
        className="object-cover w-full h-full"
      />
    </div>
  )
}
