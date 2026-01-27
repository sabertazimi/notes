---
sidebar_position: 11
tags: [Web, Node.js, Debugging]
---

# Debugging

## Inspector

[Enable inspector](https://nodejs.org/en/docs/guides/debugging-getting-started);

```bash
node --inspect server.js # Start debugging.
node --inspect-brk server.js # Start debugging and break.
```

[Enable core modules debug information](https://nodejs.dev/en/api/v18/cli/#node_debugmodule):

```bash
NODE_DEBUG=fs,net,stream yarn test
```

## Crawler

[Simple example](https://www.zenrows.com/blog/web-scraping-with-javascript-and-nodejs):

```ts
const axios = require('axios')
const cheerio = require('cheerio')
const playwright = require('playwright')

const url = 'https://scrapeme.live/shop/page/1/'
const useHeadless = false // "true" to use playwright
const maxVisits = 30 // Arbitrary number for the maximum of links visited
const visited = new Set()
const allProducts = []

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function getHtmlPlaywright(url) {
  const browser = await playwright.firefox.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(url)
  const html = await page.content()
  await browser.close()

  return html
}

async function getHtmlAxios(url) {
  const { data } = await axios.get(url)

  return data
}

async function getHtml(url) {
  return useHeadless ? await getHtmlPlaywright(url) : await getHtmlAxios(url)
}

function extractContent($) {
  return $('.product')
    .map((_, product) => {
      const $product = $(product)

      return {
        id: $product.find('a[data-product_id]').attr('data-product_id'),
        title: $product.find('h2').text(),
        price: $product.find('.price').text(),
      }
    })
    .toArray()
}

function extractLinks($) {
  return [
    ...new Set(
      $('.page-numbers a')
        .map((_, a) => $(a).attr('href'))
        .toArray()
    ),
  ]
}

async function crawl(url) {
  visited.add(url)
  console.log('Crawl: ', url)
  const html = await getHtml(url)
  const $ = cheerio.load(html)
  const content = extractContent($)
  const links = extractLinks($)
  links
    .filter(link => !visited.has(link))
    .forEach((link) => {
      q.enqueue(crawlTask, link)
    })
  allProducts.push(...content)

  // We can see how the list grows. Gotta catch 'em all!
  console.log(allProducts.length)
}

// Change the default concurrency or pass it as param
function queue(concurrency = 4) {
  let running = 0
  const tasks = []

  return {
    enqueue: async (task, ...params) => {
      tasks.push({ task, params })
      if (running >= concurrency)
        return

      ++running
      while (tasks.length) {
        const { task, params } = tasks.shift()
        await task(...params)
      }
      --running
    },
  }
}

async function crawlTask(url) {
  if (visited.size >= maxVisits) {
    console.log('Over Max Visits, exiting')
    return
  }

  if (visited.has(url))
    return

  await crawl(url)
}

const q = queue()
q.enqueue(crawlTask, url)
```

Web scraping with [impersonation](https://lev.engineer/blog/web-scraping-like-a-pro-unlocking-the-power-of-impersonation):

```ts
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://example.com')

  // Now your Puppeteer script is enhanced with advanced evasion techniques
  // Proceed with your web scraping tasks

  await browser.close()
})()

const { chromium, devices } = require('playwright')

const iPhone11 = devices['iPhone 11'];

(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
    geolocation: { latitude: 48.8584, longitude: 2.2945 }, // Paris, France
    permissions: ['geolocation'],
    locale: 'fr-FR',
    ...iPhone11,
  })
  const page = await context.newPage()
  await page.goto('https://example.com')

  // Your scraping logic here

  await browser.close()
})()
```
