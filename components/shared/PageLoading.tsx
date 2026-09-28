export default function PageLoading() {
  return (
    <div className="min-h-[40vh] bg-slate-50 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-10 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="grid gap-4 pt-6 lg:grid-cols-2">
          <div className="h-40 rounded-xl border border-slate-200 bg-white" />
          <div className="h-40 rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}
