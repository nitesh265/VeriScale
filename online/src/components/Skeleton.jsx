const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} aria-hidden="true" />
);

export const TableSkeleton = ({ columns = 5, rows = 5 }) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="overflow-x-auto">
      <div className="flex min-w-[680px] items-center gap-5 border-b bg-slate-50 px-5 py-4">
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonBlock key={`heading-${index}`} className="h-3 flex-1" />
        ))}
      </div>
      <div className="min-w-[680px] divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex items-center gap-5 px-5 py-5">
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <SkeletonBlock
                key={`cell-${rowIndex}-${columnIndex}`}
                className={`h-4 flex-1 ${columnIndex === 0 ? "max-w-24" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PanelSkeleton = ({ className = "h-32" }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
    <SkeletonBlock className="h-4 w-1/3" />
    <SkeletonBlock className="mt-5 h-8 w-2/3" />
  </div>
);

export default SkeletonBlock;
