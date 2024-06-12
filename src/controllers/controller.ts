import { json } from 'body-parser';
import reqService from '../services/req-service';

//export async function createItems(req, res): Promise<void> {
 // try {
    //await reqService.createItems("sectorFakeId", "mrcFakeId");
   // return res.status(200).send({ message: 'items created successfuly' });
 // } catch (err) {
   // console.error(err);
   // return res.status(500).send({ message: 'internal server error' });
  //}
//}





export async function getAllItems(req, res): Promise<void> {
  try {
    //console.log("ERequest : " + req);
    const data = await reqService.getAllItems(req);
    return res.status(200).send({ message: 'items fetched successfuly', data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}


export async function getVerifItems(req, res): Promise<void> {
  try {
    //console.log("ERequest : " + req);
    const data = await reqService.getVerifItems(req);
    return res.status(200).send({ message: 'items fetched successfuly', data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}



export async function getNonVerifSecteurs(req, res): Promise<void> {
  try {
    //console.log("ERequest : " + req);
    const data = await reqService.getNonVerifSecteurs(req);
    return res.status(200).send({ message: 'items fetched successfuly', data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
 
}



export async function UpdateNonVerifSecteurs(req, res): Promise<void> {
  try {
    //console.log("ERequest : " + req);
    const data = await reqService.UpdateNonVerifSecteurs(req);
    return res.status(200).send({ message: 'items fetched successfuly', data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
 
}



export async function  UpdateVerifiedLeadsDb(req, res): Promise<void> {
  try {
    //console.log("ERequest : " + req);
    const data = await reqService. UpdateVerifiedLeadsDb(req);
    return res.status(200).send({ message: 'items fetched successfuly', data: data });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
 
}