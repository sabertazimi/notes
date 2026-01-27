---
sidebar_position: 19
tags: [Web, React, Style, CSS, Styled Components, Internals]
---

# Styled Components

## Shared

```tsx
// Import styled-components and css
import styled, { css } from 'styled-components'

const container = document.querySelector('.container')

// Define new const with bold style
const headingStyle = css`
  font-weight: bold;
`

// Define typography styles
const H1 = styled.h1`
  font-size: 54px;
  // Using headingStyle const
  ${headingStyle}
`
const H2 = styled.h2`
  font-size: 36px;
  // Using headingStyle const
  ${headingStyle}
`
const H3 = styled.h3`
  font-size: 24px;
  // Using headingStyle const
  ${headingStyle}
`
const H4 = styled.h4`
  font-size: 16px;
  // Using headingStyle const
  ${headingStyle}
`
const H5 = styled.h5`
  font-size: 14px;
  // Using headingStyle const
  ${headingStyle}
`
const H6 = styled.h6`
  font-size: 12px;
  // Using headingStyle const
  ${headingStyle}
`
const Text = styled.p`
  font-size: 16px;
`
const Small = styled.small`
  font-size: 80%;
`

// Use our styles
export default function WrapperContainer() {
  return (
    <div>
      <H1>Heading h1</H1>
      <H2>Heading h2</H2>
      <H3>Heading h3</H3>
      <H4>Heading h4</H4>
      <H5>Heading h5</H5>
      <H6>Heading h6</H6>
      <Text>Body text</Text>
      <Small>Small text</Small>
    </div>
  )
}

ReactDOM.createRoot(container).render(<WrapperContainer />)
```

## Extension

```tsx
// Import styled-components
import styled from 'styled-components'

const container = document.querySelector('.container')

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  color: #fff;
  border: 0;
  border-radius: 35px;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;
`

// Using extend to create a red variant of the button
const RedButton = Button.extend`
  background-color: #e74c3c;
`

// Using extend to create a green variant of the button
const GreenButton = Button.extend`
  background-color: #2ecc71;
`

// Use our styles
export default function WrapperContainer() {
  return (
    <div>
      <Button>Default button</Button>
      <RedButton>Red button</RedButton>
      <GreenButton>Green button</GreenButton>
    </div>
  )
}

ReactDOM.createRoot(container).render(<WrapperContainer />)
```

## Props

```tsx
// Import styled-components and css
import styled, { css } from 'styled-components'

const container = document.querySelector('.container')

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  border: 0;
  border-radius: 35px;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  cursor: pointer;

  // Using props to create a gray variant of the button
  ${props =>
    props.gray
    && css`
      background-color: #95a5a6;
    `}
  // Using props to create a green variant of the button
  ${props =>
    props.green
    && css`
      background-color: #2ecc71;
    `}
  // Using props to create a red variant of the button
  ${props =>
    props.red
    && css`
      background-color: #e74c3c;
    `}
  // We can also use a ternary operator for "binary" changes
  color: ${props => (props.gray ? '#2c3e50' : '#fff')};
`

export default function WrapperContainer() {
  return (
    <div>
      <Button>Default button</Button>
      {/* Button with prop "red" */}
      <Button red>Red button</Button>
      {/* Button with prop "green" */}
      <Button green>Green button</Button>
    </div>
  )
}

ReactDOM.createRoot(container).render(<WrapperContainer />)
```

## Variants

```ts
import { styled } from '@stitches/react'

const Box = styled('div', {
  variants: {
    color: {
      pink: {
        backgroundColor: 'pink',
      },
      turquoise: {
        backgroundColor: 'turquoise',
      },
    },
    shape: {
      square: {
        borderRadius: 0,
      },
      round: {
        borderRadius: '100%',
      },
    },
    size: {
      small: {
        width: '70px',
        height: '70px',
      },
      large: {
        width: '140px',
        height: '140px',
      },
    },
    isGlowing: {
      true: {
        $$shadowColor: 'transparent',
        boxShadow: '0 0 30px $$shadowColor',
      },
    },
  },

  defaultVariants: {
    color: 'pink',
    shape: 'square',
    size: 'small',
  },

  compoundVariants: [
    {
      color: 'pink',
      isGlowing: true,
      css: {
        $$shadowColor: 'pink',
      },
    },
    {
      color: 'turquoise',
      isGlowing: true,
      css: {
        $$shadowColor: 'turquoise',
      },
    },
  ],
})
```

## Internals

Styled components [under the hood](https://www.joshwcomeau.com/react/demystifying-styled-components):

```tsx
interface Props {
  className?: string
}

function styled(Tag) {
  return (rawStyles, ...interpolations) => {
    return function NewComponent({ className }: Props) {
      // Compute the styles from the template string,
      // the interpolation functions, and the provided React props.
      const styles = reconcileStyles(rawStyles, interpolations, props)

      const uniqueClassName = comeUpWithUniqueName(styles)
      const processedStyles = runStylesThroughUtils(styles)

      createAndInjectCSSClass(uniqueClassName, processedStyles)

      const combinedClasses = [uniqueClassName, className].join(' ')

      return <Tag {...props} className={combinedClasses} />
    }
  }
}

styled.h1 = styled('h1')
styled.button = styled('button')
// ...And so on, for all DOM nodes!
```

## References

- [Tao](https://alexkondov.com/full-stack-tao-styling) of styling:
  How to Style a React Application.
