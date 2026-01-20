import clsx from "clsx";

export const TodoItem: React.FC<{
  done?: boolean;
  inProgress?: boolean;
  children: React.ReactNode;
}> = ({ children, done, inProgress }) => (
  <li
    className={clsx(
      "inline-flex list-none items-center gap-2 align-text-bottom before:inline-flex before:place-content-center before:rounded-full before:border before:border-dimmed before:text-center before:align-text-top before:text-xs/tight before:text-transparent",
      {
        "before:content-[' '] before:m-0.5 before:size-4 before:border-2":
          !done && !inProgress,
        "before:content-['️ '] before:size-5 before:bg-dimmed before:bg-clip-content before:p-0.5":
          inProgress && !done,
        "before:m-0.5 before:size-4 before:overflow-visible before:border-2 before:bg-dimmed before:bg-clip-text before:content-['✔']":
          done,
      }
    )}
  >
    <span className="text-text">{children}</span>
  </li>
);
