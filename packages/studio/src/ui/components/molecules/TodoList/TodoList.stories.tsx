import preview from "@sb/preview";

import { TodoItem } from "@/ui/components/atoms/TodoItem/TodoItem";
import { TodoList as TodoListComponent } from "@/ui/components/molecules/TodoList/TodoList";

const meta = preview.meta({
  title: "Molecules/TodoList",
  component: TodoListComponent,
  argTypes: {
    children: { control: false },
  },
  args: {
    children: (
      <>
        <TodoItem>Item 1</TodoItem>
        <TodoItem inProgress>Item 2</TodoItem>
        <TodoItem done>Item 3</TodoItem>
      </>
    ),
  },
});

export default meta;

export const TodoList = meta.story();
