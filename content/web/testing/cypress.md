---
sidebar_position: 3
tags: [Web, Testing, Cypress]
---

# Cypress

When it comes to test heavy visual features,
(e.g. fixed navigation based on window scroll event),
E2E testing helps a lot.

## Installation

```bash
yarn add -D cypress typescript
yarn cypress open
```

`cypress open` will initialize the cypress folder structure.

## Configuration

`cypress/tsconfig.json`:

```json
{
  "extends": "../tsconfig.json",
  "include": ["global.d.ts", "**/*.ts"],
  "exclude": [],
  "compilerOptions": {
    "strict": true,
    "target": "ES6",
    "lib": ["ES6", "DOM"],
    "types": ["cypress"],
    "isolatedModules": false,
    "noEmit": true
  }
}
```

`cypress/global.d.ts`:

```ts
/// <reference types="cypress" />
```

`cypress.config.ts`:

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
})
```

`tsconfig.json`:

```json
{
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "cypress"]
}
```

`package.json`:

```json
{
  "scripts": {
    "e2e:chrome": "start-server-and-test e2e:prepare http://localhost:3000 cypress:chrome",
    "e2e:firefox": "start-server-and-test e2e:prepare http://localhost:3000 cypress:firefox",
    "e2e:ui": "start-server-and-test e2e:prepare http://localhost:3000 cypress:open",
    "e2e:prepare": "yarn build && yarn serve",
    "cypress:chrome": "cypress run --browser chrome",
    "cypress:chromium": "cypress run --browser chromium",
    "cypress:edge": "cypress run --browser edge",
    "cypress:electron": "cypress run",
    "cypress:firefox": "cypress run --browser firefox",
    "cypress:open": "cypress open --browser electron --e2e"
  }
}
```

`.gitignore`:

```bash
# cypress files
cypress/screenshots
cypress/videos
```

`jest.config.js`:

```ts
const config = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/cypress/'],
}
```

## Getting Started

`cypress/support/commands.ts`:

```ts
import '@testing-library/cypress/add-commands'
```

`cypress/e2e/component.cy.ts`:

```ts
/// <reference types="cypress"/>

describe('component', () => {
  it('should work', () => {
    cy.visit('/')
    cy.get('#onOff')
      .should('have.text', 'off')
      .click()
      .should('have.text', 'on')
  })
})
```

`cypress/e2e/payment.cy.ts`:

```ts
import { v4 as uuid } from 'uuid'

describe('payment', () => {
  it('user can make payment', () => {
    //  Login.
    cy.visit('/')
    cy.findByRole('textbox', { name: /username/i }).type('sabertaz')
    cy.findByLabelText(/password/i).type('secret')
    cy.findByRole('checkbox', { name: /remember me/i }).check()
    cy.findByRole('button', { name: /sign in/i }).click()

    // Check account balance.
    let oldBalance
    cy.get('[data-test=nav-user-balance]').then(
      $balance => (oldBalance = $balance.text())
    )

    // Click on new button.
    cy.findByRole('button', { name: /new/i }).click()

    // Search for user.
    cy.findByRole('textbox').type('devon becker')
    cy.findByText(/devon becker/i).click()

    // Add amount and note and click pay.
    const paymentAmount = '5.00'
    cy.findByPlaceholderText(/amount/i).type(paymentAmount)
    const note = uuid()
    cy.findByPlaceholderText(/add a note/i).type(note)
    cy.findByRole('button', { name: /pay/i }).click()

    // Return to transactions.
    cy.findByRole('button', { name: /return to transactions/i }).click()

    // Go to personal payments.
    cy.findByRole('tab', { name: /mine/i }).click()

    // Click on payment.
    cy.findByText(note).click({ force: true })

    // Verify if payment was made.
    cy.findByText(`-$${paymentAmount}`).should('be.visible')
    cy.findByText(note).should('be.visible')

    // Verify if payment amount was deducted.
    cy.get('[data-test=nav-user-balance]').then(($balance) => {
      const convertedOldBalance = Number.parseFloat(oldBalance.replace(/\$|,/g, ''))
      const convertedNewBalance = Number.parseFloat(
        $balance.text().replace(/\$|,/g, '')
      )
      expect(convertedOldBalance - convertedNewBalance).to.equal(
        Number.parseFloat(paymentAmount)
      )
    })
  })
})
```

## Principles

- Flake resistance and retry-ability:
  don't wait for fixed time, wait for specific elements (`cy.as`):
  `cy.get`/`cy.find`/`cy.its`/`cy.should` commands will
  give the page an opportunity to fully load,
  and then the tests can proceed (Cypress run in browser directly).
- Asynchronous nature:
  use `cy.then`/`cy.wrap` for
  [async nature of Cypress](https://learn.cypress.io/cypress-fundamentals/understanding-the-asynchronous-nature-of-cypress).

## Commands

- `cy.its`: get property value on previously yielded subject.
- `cy.invoke`: invoke function on previously yielded subject.

```ts
cy.wrap(['Wai Yan', 'Yu']).its(1).should('eq', 'Yu')
cy.wrap({ age: 52 }).its('age').should('eq', 52)
cy.wait('@publicTransactions')
  .its('response.body.results')
  .invoke('slice', 0, 5)
```

Add custom commands:

```ts
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      findByRole: (role: string) => Chainable<JQuery<HTMLElement>>
      findByTestId: (testId: string) => Chainable<JQuery<HTMLElement>>
      getByRole: (role: string) => Chainable<JQuery<HTMLElement>>
      getByTestId: (testId: string) => Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add(
  'findByRole',
  { prevSubject: 'element' },
  (subject, role) => {
    return cy.wrap(subject, { log: false }).find(`[role="${role}"]`)
  }
)

Cypress.Commands.add(
  'findByTestId',
  { prevSubject: 'element' },
  (subject, testId) => {
    return cy.wrap(subject, { log: false }).find(`[data-testid="${testId}"]`)
  }
)

Cypress.Commands.add('getByRole', (role) => {
  return cy.get(`[role="${role}"]`)
})

Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})
```

Custom command [log](https://filiphric.com/improve-your-custom-command-logs-in-cypress):

```ts
Cypress.Commands.add('take', (input: string) => {
  let element: JQuery<HTMLElement> | HTMLElement[]
  let count: number

  const log = Cypress.log({
    autoEnd: false,
    consoleProps() {
      return {
        selector: input,
        Yielded: element,
        Elements: count,
      }
    },
    displayName: 'take',
    name: 'Get by [data-cy] attribute',
  })

  cy.get(`[data-cy=${input}]`, { log: false }).then(($el) => {
    element = Cypress.dom.getElements($el)
    count = $el.length
    log.set({ $el })
    log.snapshot().end()
  })

  cy.on('fail', (err) => {
    log.error(err)
    log.end()
    throw err
  })
})
```

### Action

- `cy.click`.
- `cy.dbclick`.
- `cy.type`.
- `cy.clear`.
- `cy.focus`.
- `cy.blur`.
- `cy.check`.
- `cy.uncheck`.
- `cy.select`.
- `cy.selectFile`.
- `cy.submit`.
- `cy.trigger`.
- `cy.scrollTo`.
- `cy.scrollIntoView`.

### Network

- `cy.intercept`: mock API response.

```ts
cy.intercept('GET', '/transactions/public*', {
  fixture: 'public-transactions.json',
}).as('mockedPublicTransactions')

cy.wait('@mockedPublicTransactions')

cy.intercept('GET', '/transactions/public*', {
  headers: {
    'X-Powered-By': 'Express',
    'Date': new Date().toString(),
  },
})

cy.intercept('POST', '/bankAccounts', (req) => {
  const { body } = req
  req.continue((res) => {
    res.body.data.listBankAccount = []
  })
})

cy.intercept('POST', apiGraphQL, (req) => {
  const { body } = req

  if (
    Object.hasOwn(body, 'operationName')
    && body.operationName === 'CreateBankAccount'
  ) {
    req.alias = 'gqlCreateBankAccountMutation'
  }
})
```

- `cy.request`: API integration/E2E tests.

```ts
Cypress.Commands.add('getAllPosts', () => {
  return cy.request('GET', '/api/posts').then((response) => {
    return cy.wrap(response.body)
  })
})

Cypress.Commands.add('getFirstPost', () => {
  return cy.request('GET', '/api/posts').then((response) => {
    return cy.wrap(response.body).its(0)
  })
})

describe('GET', () => {
  it('gets a list of users', () => {
    cy.request('GET', '/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.results).length.to.be.greaterThan(1)
    })
  })

  it('gets a list of comments', () => {
    cy.request('/comments').as('comments')

    cy.get('@comments').should((response) => {
      expect(response.body).to.have.length(500)
      expect(response).to.have.property('headers')
      expect(response).to.have.property('duration')
    })
  })
})
```

## Plugins

Setup `TypeScript` to transpile tests:

```ts
import wp from '@cypress/webpack-preprocessor'
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on(
        'file:preprocessor',
        wp({
          webpackOptions: {
            resolve: {
              extensions: ['.ts', '.tsx', '.js', '.jsx'],
            },
            module: {
              rules: [
                {
                  test: /\.tsx?$/,
                  loader: 'ts-loader',
                  options: { transpileOnly: true },
                },
              ],
            },
          },
        })
      )
    },
  },
})
```

`AXE` a11y testing:

```ts
// cypress.config.ts
import { defineConfig } from 'cypress'
import fetch from 'undici'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        sitemapLocations() {
          return fetch(`${config.baseUrl}/sitemap.xml`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/xml',
            },
          })
            .then(res => res.text())
            .then((xml) => {
              const locs = [...xml.matchAll(`<loc>(.|\n)*?</loc>`)].map(
                ([loc]) => loc.replace('<loc>', '').replace('</loc>', '')
              )
              return locs
            })
        },
      })

      return config
    },
  },
})

// cypress/e2e/smoke.cy.ts
it('should be accessible', () => {
  cy.task('sitemapLocations').then((pages) => {
    pages.forEach((page) => {
      cy.visit(page)
      cy.injectAxe()
      cy.checkA11y(
        {
          exclude: ['.article-action'],
        },
        {
          rules: {
            'empty-heading': { enabled: false },
            'scrollable-region-focusable': { enabled: false },
          },
        }
      )
    })
  })
})
```

- Cypress code coverage [plugin](https://github.com/bahmutov/cypress-and-jest).
- Cypress commands [plugin](https://github.com/testing-library/cypress-testing-library).
- Cypress events [plugin](https://github.com/dmtrKovalenko/cypress-real-events).
- Cypress accessibility testing [plugin](https://github.com/component-driven/cypress-axe).
- Cypress visual regression testing [plugin](https://github.com/percy/percy-cypress).

## References

- Cypress official [guide](https://learn.cypress.io).
- Cypress CI [action](https://github.com/cypress-io/github-action).
- Cypress real world [example](https://github.com/cypress-io/cypress-realworld-app).
- Cypress [cookbook](https://github.com/cypress-io/cypress-example-recipes).
