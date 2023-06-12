import { BACK_END_URL } from "./Constants";

export const deleteTask = async (uuid: string, taskId: string) => {
  await fetch(`${BACK_END_URL}/api/delete_task`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: uuid,
      task_id: taskId,
    }),
  });
}