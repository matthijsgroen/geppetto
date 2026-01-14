import preview from "@sb/preview";

import { TodoItem } from "@/ui/components/atoms/TodoItem/TodoItem";
import { TodoList as TodoListComponent } from "@/ui/components/molecules/TodoList/TodoList";

const meta = preview.meta({
  title: "Molecules/TodoList",
  component: TodoListComponent,
  subcomponents: { TodoItem },
  argTypes: {
    children: { control: false },
  },
  args: {
    children: (
      <>
        <TodoItem done>Completed item</TodoItem>
        <TodoItem inProgress>In progress item</TodoItem>
        <TodoItem>Todo item</TodoItem>
      </>
    ),
  },
});

export default meta;

export const TodoList = meta.story();
