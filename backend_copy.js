const PORT = 8000

const fs = require("fs");
const { Cluster } = require('puppeteer-cluster');
const express = require("express");

const cors = require('cors');
var species2 = fs.readFileSync("./public/listaURLnew.json");

species2 = JSON.parse(species2);
var regExpressionScrp = ""
var urlScrp = ""
var ranInfScrp = ""
var ranSupScrp = ""
var listScrp = "[]"
var resultados = []
var regularExpressions

var progressValue = 0;
var contAux = 0;

var baseURL = "https://mycocosm.jgi.doe.gov/cgi-bin/getDbSeq?db=Trire2&searchTabList=protein,proteinHitDesc&hitSeqList=";

var urls = [];
var text = "";
var sep = [];
var regularExpressions = [];

//var pattern;
var numMatch;


//import species2 from "./public/listaURLnew.json";

require('dotenv').config()
require('axios')
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({
    origin: '*'
}))
app.listen(PORT, () => console.log(`Backend running on PORT ${PORT}`));

//LISTA DE VARIABLES COMUNICACION BACK FRONTEND



//GENERADOR DE URLS 1 a N
for (let i = 1; i < 2; i++) {
    text = baseURL.concat(i);
    urls.push(text);
}

console.log(urls.length);


(async () => {
    var cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 30,
        puppeteerOptions: {
            headless: true,
            defaultViewport: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],

        },
    });


    app.get('/', cors(), (req, res) => {
        res.json("BACKEND IS WORKING")
    })
    ////////////////////////////////////////////////////////////
    app.get('/file', function (req, res) {
        res.json(resultados)
        //RESULTS OUTPUT
    })
    ////////////////////////////////////////////////////////////
    app.get('/progress', function (req, res) {
        res.json(progressValue);
        //RESULTS OUTPUT
    })
    ////////////////////////////////////////////////////////////

    app.post("/resultsScrap", async (req, res) => {
        sep = []
        urls = []
        regularExpressions = []
        let { stringtoBackend } = req.body
        sep = stringtoBackend.split("|");
        console.log(sep.length)
        contAux = 0;
        progressValue = 0;
        if (sep.length === 4) {
            urls = []
            regularExpressions = []
            regExpressionScrp = sep[0]
            urlScrp = sep[1]
            ranInfScrp = sep[2]
            ranSupScrp = sep[3]

            //pattern = regExpressionScrp
            //pattern = new RegExp(pattern, "gi")

            if (urlScrp === "globally") {
                for (var i = 0; i < species2.length; i++) {
                    baseURL = species2[i].URL;
                    for (let j = ranInfScrp; j <= ranSupScrp; j++) {
                        text = baseURL.concat(j);
                        urls.push(text);
                        regularExpressions.push(regExpressionScrp);
                    }
                }
                console.log(urls.length)

            } else {
                baseURL = urlScrp
                for (let j = ranInfScrp; j <= ranSupScrp; j++) {
                    text = baseURL.concat(j);
                    urls.push(text);
                    regularExpressions.push(regExpressionScrp);
                }
                console.log(urls.length)
            }

            console.log("La expresion regular es: " + regExpressionScrp + " la URL es: " + urlScrp + " el limite inferior es: " + ranInfScrp + " el limite superior es:" + ranSupScrp)



            for (var url of urls.keys()) {
                pattern = regularExpressions[url];
                //console.log(pattern);
                var urlAux = urls[url];
                await cluster.queue(urlAux);
            }
        }
        else {
            urls = []
            regExpressionScrp = sep[0]
            urlScrp = sep[1]
            listScrp = sep[2]
            listScrp = listScrp.split(",")

            //pattern = regExpressionScrp
            //pattern = new RegExp(pattern, "gi")
            console.log("La expresion regular es: " + regExpressionScrp + " la URL es: " + urlScrp + " la lista a buscar es: " + listScrp)

            if (urlScrp === "globally") {
                for (var i = 0; i < species2.length; i++) {
                    baseURL = species2[i].URL;
                    for (let j = ranInfScrp; j <= listScrp.length; j++) {
                        text = baseURL.concat(listScrp[j]);
                        urls.push(text);
                        regularExpressions.push(regExpressionScrp);
                    }
                }
            } else {
                baseURL = urlScrp
                for (let j = ranInfScrp; j <= listScrp.length; j++) {
                    text = baseURL.concat(listScrp[j]);
                    urls.push(text);
                    regularExpressions.push(regExpressionScrp);
                }
            }

            for (var url of urls.keys()) {
                pattern = regularExpressions[url];
                //console.log(pattern);
                var urlAux = urls[url];
                await cluster.queue(urlAux);

            }
            if (cluster.idle()) {
                progressValue = 0;
            }
        }
        sep = "";



    })

    await cluster.task(async ({ page, data: url }) => {

        var result = undefined
        var name = ""
        var spliteado = []
        var identifier = 0
        await page.goto(url);
        await page.waitForSelector("pre");
        var element = await page.$("pre");
        var text = await page.evaluate((el) => el.textContent, element);


        var replacedString = text.replace("\n", ",");
        replacedString = replacedString.replace(/\|+/g, ",");
        replacedString = replacedString.replace(/\>+/g, "");
        replacedString = replacedString.replace(/\n+/g, "");
        replacedString = replacedString.replace(/\*+/g, "");

        pattern = new RegExp(pattern, "gi");
        result = replacedString.match(pattern);
        if (result) {
            numMatch = result.length
            result = result.join(",")
        } else {
            if (replacedString.length === 0) {
                spliteado = url.split("=")
                identifier = spliteado[(spliteado.length - 1)]
                name = url.substring(url.indexOf("=") + 1, url.indexOf("&"))
                replacedString = `jgi,${name},${identifier},NO_SHORTNAME,NO_DATA`

            }
            numMatch = 0
            result = "NO MATCHES"
        }

        var newer = replacedString.split(",")
        var provider = newer[0]
        var specie = newer[1]
        var idf = newer[2]
        idf = parseInt(idf)
        var shortnames = newer[3]
        var proteom = newer[4]


        resultados.push({
            provider,
            specie,
            idf,
            shortnames,
            proteom,
            regExpressionScrp,
            numMatch,
            result
        })

        fs.appendFile('results.csv', `${replacedString},${pattern},${numMatch},${result}\n`, function (err) { if (err) throw err; });
        progressValue = (contAux * 100) / urls.length;
        contAux++;


    });


})();



