import { stat } from "fs";
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
    headless: chrome.headless,
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  console.log(typeof req.query.url);

  const url: string = `${req.query.url}`;

  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  const pdf = await page.pdf({
    format: "a4",
    margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
  });
  await page.close();
  await browser.close();

  return pdf;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  const pdf = await printPdf(req, res);

  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
}
