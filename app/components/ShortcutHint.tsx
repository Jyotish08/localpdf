export default function ShortcutHint({ shortcut, label }: { shortcut: string; label?: string }) {
  return (
    <div className="hidden items-center gap-1.5 sm:flex">
      {label && <span className="text-xs text-muted">{label}</span>}
      <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded bg-muted/20 px-1 font-sans text-[10px] font-semibold text-muted ring-1 ring-inset ring-muted/30">
        {shortcut}
      </kbd>
    </div>
  );
}
