interface HomeHeaderProps {
  userName: string;
  avatarUrl?: string;
}

export function HomeHeader({ userName, avatarUrl }: HomeHeaderProps) {
  return (
    <header className="px-5 pt-8 pb-6 flex justify-between items-center sticky top-0 z-40 bg-surface">
      <h1 className="font-h1 text-on-surface">Hello, {userName} 👋</h1>

      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
        {avatarUrl ? (
          <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-on-surface">
            <span className="text-white text-base font-bold">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
