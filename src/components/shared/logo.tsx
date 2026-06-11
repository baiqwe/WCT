import { cn } from '@/lib/utils';
import { IconTrophy } from '@tabler/icons-react';

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid size-8 place-items-center rounded-md border border-[#c7ff57]/30 bg-[#c7ff57] text-[#071007] shadow-[0_0_28px_rgba(199,255,87,0.26)]',
        className
      )}
      aria-hidden="true"
    >
      <IconTrophy className="size-4" />
    </span>
  );
}
