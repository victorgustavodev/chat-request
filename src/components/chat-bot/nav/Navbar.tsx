import { IoMenu } from "react-icons/io5";

export function Navbar(props: { function: () => void }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-8 bg-transparent">
        <button onClick={props.function} className="cursor-pointer text-3xl">
          <IoMenu />
        </button>
        {/* <span>
                          <Image
                            src="/images/user-profile.png"
                            width={40}
                            height={40}
                            alt="Picture of the author"
                          />
                        </span> */}
      </div>
    </div>
  );
}
