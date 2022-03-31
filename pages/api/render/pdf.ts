import fs, { stat } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import chrome from "chrome-aws-lambda";

type Data = {
  pdf: string;
};
async function printPdf(req: NextApiRequest, res: NextApiResponse) {
  const options = {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  console.log(typeof req.query.url);

  
  const url: string = `${req.query.url}`;

    await page.goto(url, {
    waitUntil: "networkidle2", timeout: 0
  });
  const pdfStream = await page.createPDFStream({
    format: "a4",
    margin: { top: "0.5cm", bottom: "0.5cm", left: "1cm", right: "1cm" },
    landscape: true, 
    timeout: 0
  });
  // const writeStream = fs.createWriteStream('rapport_etude.pdf');
  
  // pdfStream.pipe(writeStream);
  pdfStream.on('end', async () => {
    await browser.close();
  });

  return pdfStream;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  const pdf = await printPdf(req, res);

  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
}
