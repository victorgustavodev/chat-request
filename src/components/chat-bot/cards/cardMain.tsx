/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

export function CardMain(props: { bodyText?: string }) {
  return (
    <div className="p-4 lg:p-12 bg-white flex rounded-md shadow-md w-full">
      <span className="pr-3 md:pr-5">
        <img
          src="/images/Bot-icon.png"
          className="min-w-[20px] md:min-w-[40px]"
        />
      </span>
      <p className="text-sm lg:text-lg">
        {props.bodyText || "Olá, como posso te ajudar hoje?"}
      </p>
    </div>
  );
}
