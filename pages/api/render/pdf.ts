import { stat } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

type Data = {
  pdf: string;
};
async function printPdf(req: NextApiRequest, res: NextApiResponse) {
  const puppeteer = require("puppeteer");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(req.query.url, {
    waitUntil: "networkidle2",
  });
  const pdf = await page.pdf({
    format: "A4",
    margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
  });
  await page.close();
  await browser.close();

  return pdf;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const pdf = await printPdf(req, res);

  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
}
