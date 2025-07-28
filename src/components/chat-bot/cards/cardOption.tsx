export function CardOption(props: { title: string; description?: string }) {
  return (
    <div className="cursor-pointer flex flex-col w-3/4 lg:w-full text-start justify-center items-center my-2 bg-white hover:bg-emerald-100/80 transition-colors p-4 rounded-md shadow-md border-[#0F553A] border-1">
      <h1 className="text-[12px]">{props.title}</h1>
      <span className="text-[10px]">{props.description}</span>
    </div>
  );
}
