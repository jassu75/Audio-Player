import cloudinary from "../Config/cloudinary.js";

const deleteAssets = async (assets) => {
  const sleep = () => new Promise((res) => setTimeout(res, 200));

  for (let i = 0; i < assets.length; i += 50) {
    const assetBatch = assets.slice(i, i + 50);
    await Promise.allSettled(
      assetBatch.map(({ id, type }) =>
        cloudinary.uploader.destroy(id, { resource_type: type })
      )
    );
    await sleep();
  }
};

export default deleteAssets;
