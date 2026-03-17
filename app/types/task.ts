export type TaskCategory = 'Work' | 'Personal' | 'Study';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  userEmail: string;
  dueDate?: string;
  category?: TaskCategory;
};