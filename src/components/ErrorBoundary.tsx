import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Unhandled render error", error, info.componentStack);
    }
    // Phase 5 wires Sentry in here.
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex items-center justify-center gap-4">
            <span className="hairline" />
            <span className="eyebrow">Something went wrong</span>
            <span className="hairline" />
          </div>
          <h1 className="font-serif text-h2 text-foreground">
            The page didn't <span className="font-light italic">load properly.</span>
          </h1>
          <p className="mt-6 text-[15px] leading-[1.85] text-muted-foreground">
            An unexpected error interrupted this view. Reloading usually clears it — if it
            persists, please reach the studio directly.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="focus-ring inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-colors duration-500 hover:bg-accent"
            >
              Reload the page
            </button>
            <a
              href="/"
              className="focus-ring text-[12px] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground"
            >
              <span className="border-b border-foreground/40 pb-1">Back to home</span>
            </a>
          </div>
        </div>
      </main>
    );
  }
}
