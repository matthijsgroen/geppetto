import clsx from "clsx";

export const TodoItem: React.FC<{
  done?: boolean;
  inProgress?: boolean;
  children: React.ReactNode;
}> = ({ children, done, inProgress }) => (
  <li
    className={clsx(
      "list-none align-text-bottom before:me-2 before:inline-flex before:size-5 before:place-content-center before:rounded-sm before:border before:border-dimmed before:align-text-bottom before:text-xs",
      {
        "before:content-[' ']": !done && !inProgress,
        "bg-text bg-clip-text text-transparent before:content-['️→']":
          inProgress && !done,
        "bg-text bg-clip-text text-transparent before:content-['✔️']": done,
      }
    )}
  >
    <span className="text-text">{children}</span>
  </li>
);
