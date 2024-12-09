type ClientOptionsProps = {
  body?: any;
} & Omit<RequestInit, "body">;

export const client = async <T>(
  endpoint: string,
  options: ClientOptionsProps = {}
): Promise<T> => {
  const { headers, body, ...rest } = options;

  const response = await fetch(`/api/${endpoint}`, {
    body: JSON.stringify(body),
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  return response.json() as T;
};
