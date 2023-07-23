const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate.js');
// Files

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const output = ` The fact about avacado \n ${textIn} \n ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", output);
// console.log("File Written");

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error 🔴");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2 + data3}`, "utf-8", (err) => {
//         console.log("Writing Done");
//       });
//     });
//   });
// });

// console.log(`Reading and Writing`);

// Server
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(url.parse(req.url, true));

  //OVerview Page

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => {
        return replaceTemplate(templateCard, el);
      })
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS}', cardsHtml);
    res.end(output);

    //Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    //Api Page
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Error
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello world',
    });

    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to the port 8000');
});
