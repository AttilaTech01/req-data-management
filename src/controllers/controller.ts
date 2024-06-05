import reqService from '../services/req-service';

export async function createItems(req, res): Promise<void> {
  try {
    await reqService.createItems("sectorFakeId", "mrcFakeId");
    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}
