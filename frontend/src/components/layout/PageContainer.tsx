import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function PageContainer({ children, className, centered = false }: PageContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        centered && 'min-h-[80vh] flex items-center justify-center px-4',
        className
      )}
    >
      {children}
    </div>
  );
}
