export const cmsApi = async (path: string) => {
  const res = await fetch(`https://themount-cms.codeministry.net/api/${path}`, {
    headers: {
      Authorization: `Bearer a5b08b75897524b27fb9ce2f9f9d1acaf5f2d5d21732e35c392288fb6ab30705e64a5017937bb0e6fee2d522534cf56963d88524a1b6533f7575311573ff2aeb5949d0c26e67afe86b05bf77638742a5266b935e2d5123b3e7481a17cb1d029c3fc83c3a0f9bb53ad419888a06d22902c6c91ff5eacc4c3648a82dedbeaf48e2`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch CMS API');
  }

  return await res.json();
};

export const getServices = () => cmsApi('services');
export const getService = (id: string) => cmsApi(`services/${id}?populate=*`);

