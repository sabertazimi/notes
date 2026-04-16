---
sidebar_position: 3
tags: [Web, DevOps, SEO, JamStack]
---

# SEO

## Metadata

```tsx
import { Helmet } from 'react-helmet'

export default function App() {
  const seo = {
    title: 'About',
    description:
      'This is an awesome site that you definitely should check out.',
    url: 'https://www.mydomain.com/about',
    image: 'https://mydomain.com/images/home/logo.png',
  }

  return (
    <Helmet
      title={`${seo.title} | Code Mochi`}
      meta={[
        {
          name: 'description',
          property: 'og:description',
          content: seo.description,
        },
        { property: 'og:title', content: `${seo.title} | Code Mochi` },
        { property: 'og:url', content: seo.url },
        { property: 'og:image', content: seo.image },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'twitter:image:src', content: seo.image },
        { property: 'twitter:title', content: `${seo.title} | Code Mochi` },
        { property: 'twitter:description', content: seo.description },
      ]}
    />
  )
}
```

## `AEO`

[Agent engine optimization](https://addyosmani.com/blog/agentic-engine-optimization):

Discovery

- [ ] `llms.txt` exists at root with structured index of all documentation
- [ ] `robots.txt` does not inadvertently block known AI agent user-agents
- [ ] `agent-permissions.json` defines access rules for automated clients
- [ ] `AGENTS.md` exists in code repositories linking to relevant docs

Content structure

- [ ] Documentation pages available as clean Markdown (not just rendered HTML)
- [ ] Each page leads with a clear outcome statement in the first 200 words
- [ ] Headings are consistent and hierarchically correct
- [ ] Code examples immediately follow their prose description
- [ ] Parameter references use tables, not nested prose

Token economics

- [ ] Token counts are tracked per documentation page
- [ ] No single page exceeds 30,000 tokens without chunking strategy
- [ ] Token counts exposed in `llms.txt` for key pages
- [ ] Token counts available as page metadata (meta tag or HTTP header)

Capability signaling

- [ ] `Skill.md` files describe what each service/API does, not just how to call it
- [ ] Each skill includes: capabilities, required inputs, constraints, key doc links
- [ ] MCP server available for direct agent integration (if applicable)

Analytics

- [ ] AI referral sources segmented in web analytics
- [ ] Server logs monitored for known AI agent HTTP fingerprints
- [ ] Baseline established for AI vs. human traffic ratio

UX bridge

- [ ] `Copy for AI` button available on documentation pages
- [ ] Markdown source accessible via URL convention (e.g. `appending.md`)

## Best Practices

- [Server side rendering](https://css-tricks.com/server-side-react-rendering)
  (e.g. Next.js).
- [Pre-Rendering](https://github.com/chrisvfritz/prerender-spa-plugin)
- Mobile performance optimization
  (e.g. minify resources, code splitting, CDN, lazy loading, minimize reflows).
- SEO-friendly [routing](https://reacttraining.com/react-router) and URL management.
- [Google webmaster tools](https://www.google.com/webmasters)
- `<title>` and `<meta>` in `<head>` (with tool like `react-helmet`).
- Includes a `robots.txt` file.

## References

- Build your own [RSC framework](https://www.cmrg.me/blog/rsc-part-2-the-code).
- Build your own [Next.js](https://hire.jonasgalvez.com.br/2022/may/18/building-a-mini-next-js).
- Build your own [web framework](https://vercel.com/blog/build-your-own-web-framework).
- Modern websites building [patterns](https://dev.to/this-is-learning/patterns-for-building-javascript-websites-in-2022-5a93).
- Modern rendering [patterns](https://www.patterns.dev/posts/#rendering-patterns).
- Basic SEO [guide](https://developers.google.com/search/docs/guides/javascript-seo-basics).
- SPA SEO [guide](https://snipcart.com/spa-seo).
- Google SEO [guide](https://web.dev/google-search-tools).
