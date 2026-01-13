import clsx from "clsx";

export const TodoItem: React.FC<{
  done?: boolean;
  inProgress?: boolean;
  children: React.ReactNode;
}> = ({ children, done, inProgress }) => (
  <li
    className={clsx(
      "list-none align-text-bottom before:me-2 before:inline-flex before:place-content-center before:rounded-full before:border before:border-dimmed before:align-text-bottom",
      {
        "before:content-[' '] before:m-0.5 before:size-4 before:text-xs":
          !done && !inProgress,
        "before:content-['️ '] before:size-5 before:bg-dimmed before:bg-clip-content before:p-0.5 before:text-xs":
          inProgress && !done,
        "before:m-0.5 before:size-4 before:overflow-visible before:border-2 before:bg-text before:bg-clip-text before:align-text-top before:text-xs/tight before:text-transparent before:content-['✔️']":
          done,
      }
    )}
  >
    <span className="text-text">{children}</span>
  </li>
);
