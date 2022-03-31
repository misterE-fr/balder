import type {NextApiRequest, NextApiResponse} from "next";
import puppeteer from "puppeteer";
import chrome from "chrome-aws-lambda";
import {Stream} from "stream";
import {Buffer} from "buffer";

type Data = {
    pdf: string;
};


export const config = {
    api: {
        responseLimit: false,
        bodyParser: {
            sizeLimit: '15mb' // Set desired value here
        }
    }
}


async function printPdf(req: NextApiRequest, res: NextApiResponse) {
    const options = {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: true,
    };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    const url: string = `${req.query.url}`;

    await page.goto(url, {
        waitUntil: "networkidle2", timeout: 0
    });

    // const writeStream = fs.createWriteStream('rapport_etude.pdf');

    // pdfStream.pipe(writeStream);

    return await page.pdf({
        format: "a4",
        margin: {top: "0.5cm", bottom: "0.5cm", left: "1cm", right: "1cm"},
        landscape: true,
        timeout: 0
    })
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Buffer>
) {

    const pdf = await printPdf(req, res);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Disposition', 'attachment; filename=rapport_etude.pdf');
    res.send(pdf)

    // printPdf(req, res).on('end', async () => {
    //   await browser.close();
    // });

}
