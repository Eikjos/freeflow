type ClientOptionsProps = {
  body?: any;
} & Omit<RequestInit, "body" | "headers">;

export const client = async <T>(
  endpoint: string,
  options: ClientOptionsProps = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
    {
      headers,
      credentials: "include",
      ...options,
    }
  );

  console.log("response", await response.json());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  return (await response.json()) as T;
};
