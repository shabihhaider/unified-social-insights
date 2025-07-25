const SkeletonCard = () => (
  <div className="animate-pulse bg-brand-pure/40 dark:bg-brand-carbon/30 rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand flex flex-col gap-4">
    <div className="flex gap-4 items-center">
      <div className="w-16 h-16 rounded-xl bg-brand-electric/20"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-brand-frost/30 rounded w-1/2"></div>
        <div className="h-3 bg-brand-frost/20 rounded w-1/3"></div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="h-4 bg-brand-frost/20 rounded"></div>
      <div className="h-4 bg-brand-frost/20 rounded"></div>
      <div className="h-4 bg-brand-frost/20 rounded"></div>
    </div>
    <div className="h-3 bg-brand-frost/10 rounded w-1/4 mt-2"></div>
  </div>
);

export default SkeletonCard;
