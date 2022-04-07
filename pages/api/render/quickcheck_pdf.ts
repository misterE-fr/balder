import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import chrome from "chrome-aws-lambda";
import { Stream } from "stream";

type Data = {
  pdf: string;
};

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
};

async function printQuickCheck(req: NextApiRequest, res: NextApiResponse) {
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
    waitUntil: "networkidle2",
  });
  // await page.close();
  // await browser.close();

  return await page.pdf({
    format: "a4",
    margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
    landscape: false,
    timeout: 0,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer>
) {
  const pdf = await printQuickCheck(req, res);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Disposition", "attachment; filename=quick_check.pdf");
  res.send(pdf);
}
