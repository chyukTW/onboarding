import { makeVar } from '@apollo/client';

export type Task = {
  id: number;
  text: string;
}

const taskIndexRefVar = makeVar(0);

const tasksVar = makeVar<Task[]>([]);

export const addTask = (task: string) => {
  const prevId = taskIndexRefVar();
  const prevTasks = tasksVar();
  
  tasksVar([
    ...prevTasks,
    {
      id: prevId + 1,
      text: task
    }
  ]);
  taskIndexRefVar(prevId + 1);
};

export const deleteTask = (id: number) => {
  const prevTasks = tasksVar();
  const targetIndex = prevTasks.findIndex(task => task.id === id);
  
  if(targetIndex === -1) return;

  tasksVar([
    ...prevTasks.slice(0, targetIndex),
    ...prevTasks.slice(targetIndex + 1)
  ])
};

export default tasksVar;