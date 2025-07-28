import Image from "next/image";

export function CardMain() {
  return (
    <div className="p-5 bg-white flex rounded-md shadow-md">
      <span className="mr-4">
        <Image
          src="/images/Bot-icon.png"
          width={200}
          height={200}
          alt="User Profile"
        />
      </span>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, nihil at
        laudantium sequi expedita cupiditate deleniti porro ex doloremque labore
        earum quibusdam repudiandae vel distinctio animi. Architecto omnis at
        reprehenderit.
      </p>
    </div>
  );
}
