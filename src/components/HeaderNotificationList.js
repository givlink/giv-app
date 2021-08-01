export default function Header() {
  return (
    <div className="mb-16">
      <header className="z-10 border-b border-gray-200 bg-white px-3 py-2 shadow fixed w-full top-0">
        <div className="flex items-center justify-between">
          <img
            width="40"
            src="/image/giv_logo.png"
            alt="Giv"
            className="object-cover"
          />
        </div>
      </header>
    </div>
  );
}
