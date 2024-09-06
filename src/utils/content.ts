export const cmsApi = async (path: string) => {
  const res = await fetch(`https://themount-cms.codeministry.net/api/${path}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_CMS_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch CMS API');
  }

  return await res.json();
};

export const getServices = () => cmsApi('services');
export const getService = (id: string) => cmsApi(`services/${id}?populate=*`);

