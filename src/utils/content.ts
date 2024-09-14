export const cmsApi = async (path: string) => {
  const res = await fetch(`https://themount-cms.codeministry.net/api/${path}`, {
    headers: {
      Authorization: `Bearer c3dabaa494d0c7aa5e8bb8558a7b8e254c3cb298766d31193d859a3dc6968063141259b5fedf2c05a1ae4589ed0c78ba848c7d76c9a18638663847afb23369a02d33878641186c167e258d94fd259baad7b19ca014398e1f7f2db3b36c2ef3a8acdfe1602ea5c86e62625eb3e8a0c3ef522f85799f25e483ba51536dff8867cf`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch CMS API');
  }

  return await res.json();
};

export const getServices = () => cmsApi('services');
export const getService = (id: string) => cmsApi(`services/${id}?populate=*`);

