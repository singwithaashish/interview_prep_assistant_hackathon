// we will be giving chatgpt the resume and the job description and ask it to give us all the preparations needed for the job as well as the skills needed for the job

import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (!req.body.resume || !req.body.jobDescription)
    return res.status(400).json({ error: "Missing required fields" });

  const { resume, jobDescription } = req.body;
  const apiResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "you are interviewprep assistant. You take in a job description and resume from potential client and prepare all the possible relavant questions for that job description along with some resources to prepare. You also give the client a list of skills that they need to learn to get the job and also how likely they are to get the job.",
      },
      {
        role: "user",
        content: `resume ${resume} job description ${jobDescription}`,
      },
    ],
  });

//   console.log(apiResponse);

  return res.status(200).json({ message: apiResponse.data.choices[0].message });

// return res.status(200).json({ resume, jobDescription });
}
