export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="surface-card rounded-xl p-7">
          <p className="eyebrow text-blue-700">
            Settings
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Prototype settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Settings are not persisted in this prototype. Production access
            controls, notifications, and integrations would be configured here.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="surface-card rounded-xl p-5">
            <p className="text-sm font-semibold text-slate-900">Access model</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Simulated matter access only. Production RBAC is not implemented.
            </p>
          </div>
          <div className="surface-card rounded-xl p-5">
            <p className="text-sm font-semibold text-slate-900">Document uploads</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload actions are simulated and do not store files.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
