import reqService from '../services/req-service';

export async function createItems(req, res): Promise<void> {
  try {
    await reqService.createItems("sectorFakeId", "mrcFakeId");
    return res.status(200).send({ message: 'items created successfuly' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

export async function getAllItems(req, res): Promise<void> {
  try {
    await reqService.getAllItems();
    return res.status(200).send({ message: 'items fetched successfuly' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}
