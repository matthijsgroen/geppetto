import {
  Component,
  createContext,
  type PropsWithChildren,
  type ReactNode,
} from "react";

type Props = PropsWithChildren<{
  fallback: ReactNode;
}>;

export const ErrorContext = createContext<{ error: Error | null }>({
  error: null,
});

export class ErrorBoundary extends Component<
  Props,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorContext value={{ error: this.state.error }}>
          {this.props.fallback}
        </ErrorContext>
      );
    }

    return this.props.children;
  }
}
