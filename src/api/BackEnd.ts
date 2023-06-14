import { BACK_END_URL } from './Constants';

export const deleteTask = async (taskId: string) => {
  await fetch(`${BACK_END_URL}/api/delete_task`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task_id: taskId,
    }),
  });
};

export const checkId = async (uuid: string): Promise<boolean> => {
  const response = await fetch(`${BACK_END_URL}/api/check_id`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: uuid,
    }),
  });
  const exists = await response.json();
  return exists;
};

export const createUser = async (uuid: string): Promise<boolean> => {
  const response = await fetch(`${BACK_END_URL}/api/create_user`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: uuid,
    }),
  });
  return response.ok;
};

export const generateUuid = async () => {
  const response = await fetch(`${BACK_END_URL}/api/generate_id`);
  const data = await response.json();
  return data.id;
};

export const getUser = async (uuid: string): Promise<any> => {
  const response = await fetch(`${BACK_END_URL}/api/get_user`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: uuid,
    }),
  });
  const data = await response.json();
  return data;
};

export const addUserToGroup = async (username: string, groupId: string): Promise<boolean> => {
  const response = await fetch(`${BACK_END_URL}/api/join_group`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: username,
      group_id: groupId
    })
  });
  return response.ok;
}