import { NextApiRequest, NextApiResponse } from 'next';
import pdfParse from 'pdf-parse';

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  const fileBuffer = req.body;
  try {
    const data = await pdfParse(fileBuffer);
    res.status(200).json({ text: data.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
