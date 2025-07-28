import Image from "next/image";
import { IoMenu } from "react-icons/io5";

export function Navbar() {
    return (
        <div className="w-full">
                      <div className="flex justify-between items-center p-8">
                        <button className="cursor-pointer text-3xl">
                          <IoMenu />
                        </button>
                        <span>
                          <Image
                            src="/images/user-profile.png"
                            width={40}
                            height={40}
                            alt="Picture of the author"
                          />
                        </span>
                      </div>
                    </div>
    )
}