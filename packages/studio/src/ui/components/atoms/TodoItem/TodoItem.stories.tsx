import preview from "@sb/preview";

import { TodoItem as TodoItemComponent } from "@/ui/components/atoms/TodoItem/TodoItem";

const meta = preview.meta({
  title: "Atoms/TodoItem",
  component: TodoItemComponent,
  argTypes: {
    children: { control: "text" },
    done: { control: "boolean" },
    inProgress: { control: "boolean" },
  },
  args: {
    children: "Sample Todo Item",
    done: false,
    inProgress: false,
  },
});

export default meta;

export const TodoItem = meta.story();
