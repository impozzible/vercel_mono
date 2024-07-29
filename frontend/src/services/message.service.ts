import { callExternalApi } from "./external-api.service";

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;

export const getPublicResource = async () => {
  const config = {
    url: `${apiServerUrl}/api/messages/public`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    timeout: 5000, // 5 seconds timeout
  };

  const { data, error } = await callExternalApi<any>({ config });
  return {
    data: data || null,
    error,
  };
};

export const getProtectedResource = async (accessToken: string) => {
  const config = {
    url: `${apiServerUrl}/api/messages/protected`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi<any>({ config });

  return {
    data: data || null,
    error,
  };
};

export const getAdminResource = async (accessToken: string) => {
  const config = {
    url: `${apiServerUrl}/api/messages/admin`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi<any>({ config });

  return {
    data: data || null,
    error,
  };
};
