import { StaticImageData } from 'next/image'

interface CompleteCardProps {
  name: string;
  index: number;    
}

interface UserNameProps {
  name: string;
}

interface ImageProps {
  src: string;
  className: string;
  alt: string;
}

const ProfileImage: React.FC<ImageProps> = ({ src, className, alt }) => (
    <img
      loading="lazy"
      src={src}
      className={className}
      alt={alt}
    />
  );

  const UserName: React.FC<UserNameProps> = ({ name }) => (
    <div className="self-start mt-8 ml-12 text-4xl font-bold leading-none text-black">
      {name}<span className="font-medium">님이</span>
    </div>
  );

const CompleteCard = ({ name, index }: CompleteCardProps) => {
  return (
    <div className="relative pt-8 bg-white min-w-[512px] min-h-[512px] max-w-[512px] max-h-[512px] select-none">
      <div className="absolute top-0 right-0">
        <img src="/assets/images/court-attack-logo.svg" alt="헌법재판소" width={150} height={100} />
      </div>
      
      <UserName name={name} />
      
      <div className="flex relative flex-col absolute top-0 left-0 right-0 w-full h-full">

        <svg width="512" height="153" viewBox="0 0 512 153" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g style={{ mixBlendMode: 'multiply' }}>
          <path d="M-45 104.867C192.1 51.4678 326.722 36.1756 573 62.237" stroke="#00FF59" strokeWidth="97.6724"/>
    </g>
        </svg>
        <div className="absolute top-0 left-0 right-0 bottom-0">
        <div className="flex items-baseline text-[100px] self-start mt-0 ml-12 font-suit leading-none text-black font-[900]">
          {index.toLocaleString()}번째
        </div>
        <div className="text-[30px] self-start mt-2 ml-12 text-black leading-tight font-medium">
        시민으로 헌법재판소로 <br />앞장서는 중
    </div>
        </div>
      </div>

      
      <div className="absolute left-0 right-0 bottom-0">
        <img src="/assets/images/complete-card-bg.svg" alt="헌법재판소" width={512} height={152} />
      </div>
    </div>
  )
}

export default CompleteCard;