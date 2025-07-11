import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };