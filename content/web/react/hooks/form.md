---
sidebar_position: 22
tags: [Web, React, Hook, Form]
---

# Form

## State

- `useState` for form entire state and form control data.
- Custom logic via hooks `params` function.

```ts
import { useState } from 'react'

function useForm(callback) {
  const [values, setValues] = useState({})

  const handleSubmit = (event) => {
    if (event)
      event.preventDefault()
    callback()
  }

  const handleChange = (event) => {
    event.persist()
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value,
    }))
  }

  return {
    handleChange,
    handleSubmit,
    values,
  }
}

export default useForm
```

## Ref

- `useState` for form entire state.
- `useRef` for form control data.
- Custom logic via hooks `params` function.

```tsx
export function useField(
  name,
  form,
  { defaultValue, validations = [], fieldsToValidateOnChange = [name] } = {}
) {
  const [value, setValue] = useState(defaultValue)
  const [errors, setErrors] = useState([])
  const [pristine, setPristine] = useState(true)
  const [validating, setValidating] = useState(false)
  const validateCounterRef = useRef(0)

  const validate = async () => {
    const validateIteration = ++validateCounterRef.current
    setValidating(true)
    const formData = form.getFormData()
    let errorMessages = await Promise.all(
      validations.map(validation => validation(formData, name))
    )
    errorMessages = errorMessages.filter(Boolean)
    if (validateIteration === validateCounterRef.current) {
      // this is the most recent invocation
      setErrors(errorMessages)
      setValidating(false)
    }
    return errorMessages.length === 0
  }

  useEffect(() => {
    if (pristine)
      return // Avoid validate on mount
    form.validateFields(fieldsToValidateOnChange)
  }, [value])

  const field = {
    name,
    value,
    errors,
    setErrors,
    pristine,
    onChange: (e) => {
      if (pristine)
        setPristine(false)

      setValue(e.target.value)
    },
    validate,
    validating,
  }
  form.addField(field)
  return field
}

export function useForm({ onSubmit }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fieldsRef = useRef([])

  const validateFields = async (fieldNames) => {
    let fieldsToValidate
    if (Array.is(fieldNames)) {
      fieldsToValidate = fieldsRef.current.filter(field =>
        fieldNames.includes(field.name)
      )
    } else {
      // If fieldNames not provided, validate all fields.
      fieldsToValidate = fieldsRef.current
    }
    const fieldsValid = await Promise.all(
      fieldsToValidate.map(field => field.validate())
    )
    return fieldsValid.every(Boolean)
  }

  const getFormData = () => {
    return fieldsRef.current.reduce((formData, f) => {
      formData[f.name] = f.value
      return formData
    }, {})
  }

  return {
    onSubmit: async (e) => {
      e.preventDefault()
      setSubmitting(true)
      setSubmitted(true) // User has attempted to submit form at least once
      const formValid = await validateFields()
      const returnVal = await onSubmit(getFormData(), formValid)
      setSubmitting(false)
      return returnVal
    },
    isValid: () => fieldsRef.current.every(f => f.errors.length === 0),
    addField: field => fieldsRef.current.push(field),
    getFormData,
    validateFields,
    submitted,
    submitting,
  }
}
```

```tsx
interface Props {
  label: string
  name: string
  value: string
  onChange: Function
  errors: string[]
  setErrors: Function[]
  pristine: boolean
  validating: boolean
  validate: Function
  formSubmitted: boolean
}

export default function Field({
  label,
  name,
  value,
  onChange,
  errors,
  setErrors,
  pristine,
  validating,
  validate,
  formSubmitted,
  ...other
}: Props) {
  const showErrors = (!pristine || formSubmitted) && !!errors.length

  return (
    <FormControl className="field" error={showErrors}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input
        id={name}
        value={value}
        onChange={onChange}
        onBlur={() => !pristine && validate()}
        endAdornment={(
          <InputAdornment position="end">
            {validating && <LoadingIcon className="rotate" />}
          </InputAdornment>
        )}
        {...other}
      />
      <FormHelperText component="div">
        {showErrors
          && errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
      </FormHelperText>
    </FormControl>
  )
}
```

```tsx
export default function App(props) {
  const form = useForm({
    onSubmit: async (formData, valid) => {
      if (!valid)
        return
      await timeout(2000) // Simulate network time
      if (formData.username.length < 10) {
        // Simulate 400 response from server.
        usernameField.setErrors(['Make a longer username'])
      } else {
        // Simulate 201 response from server.
        window.alert(
          `form valid: ${valid}, form data: ${JSON.stringify(formData)}`
        )
      }
    },
  })

  const usernameField = useField('username', form, {
    defaultValue: '',
    validations: [
      async (formData) => {
        await timeout(2000)
        return formData.username.length < 6 && 'Username already exists'
      },
    ],
    fieldsToValidateOnChange: [],
  })
  const passwordField = useField('password', form, {
    defaultValue: '',
    validations: [
      formData =>
        formData.password.length < 6
        && 'Password must be at least 6 characters',
    ],
    fieldsToValidateOnChange: ['password', 'confirmPassword'],
  })
  const confirmPasswordField = useField('confirmPassword', form, {
    defaultValue: '',
    validations: [
      formData =>
        formData.password !== formData.confirmPassword
        && 'Passwords do not match',
    ],
    fieldsToValidateOnChange: ['password', 'confirmPassword'],
  })

  const requiredFields = [usernameField, passwordField, confirmPasswordField]

  return (
    <div id="form-container">
      <form onSubmit={form.onSubmit}>
        <Field
          {...usernameField}
          formSubmitted={form.submitted}
          label="Username"
        />
        <Field
          {...passwordField}
          formSubmitted={form.submitted}
          label="Password"
          type="password"
        />
        <Field
          {...confirmPasswordField}
          formSubmitted={form.submitted}
          label="Confirm Password"
          type="password"
        />
        <Button
          type="submit"
          disabled={
            !form.isValid()
            || form.submitting
            || requiredFields.some(f => f.pristine)
          }
        >
          {form.submitting ? 'Submitting' : 'Submit'}
        </Button>
      </form>
    </div>
  )
}
```

## DOM Ref

- `useState` for form entire state.
- `useRef` for form control data.
- `Function Refs` bind to native `<input />` elements.
- Custom logic via hooks `return` function.

```tsx
// https://github.com/react-hook-form/react-hook-form/blob/v7.29.0/src/logic/createFormControl.ts
function createFormControl() {
  return {
    register: (name, options = {}) => {
      // Register input filed.
      let field = get(_fields, name)
      const disabledIsDefined = isBoolean(options.disabled)

      set(_fields, name, {
        _f: {
          ...(field && field._f ? field._f : { ref: { name } }),
          name,
          mount: true,
          ...options,
        },
      })
      _names.mount.add(name)

      field
        ? disabledIsDefined
        && set(
          _formValues,
          name,
          options.disabled
            ? undefined
            : get(_formValues, name, getFieldValue(field._f))
        )
        : updateValidAndValue(name, true, options.value)

      return {
        // Bind to Form Input Element.
        ref: (ref: HTMLInputElement | null): void => {
          if (ref) {
            register(name, options)
            field = get(_fields, name)

            const fieldRef = isUndefined(ref.value)
              ? ref.querySelectorAll
                ? (ref.querySelectorAll('input,select,textarea')[0] as Ref)
                || ref
                : ref
              : ref
            const radioOrCheckbox = isRadioOrCheckbox(fieldRef)
            const refs = field._f.refs || []

            if (
              radioOrCheckbox
                ? refs.find((option: Ref) => option === fieldRef)
                : fieldRef === field._f.ref
            ) {
              return
            }

            set(_fields, name, {
              _f: {
                ...field._f,
                ...(radioOrCheckbox
                  ? {
                      refs: [...refs.filter(live), fieldRef],
                      ref: { type: fieldRef.type, name },
                    }
                  : { ref: fieldRef }),
              },
            })

            updateValidAndValue(name, false, undefined, fieldRef)
          } else {
            field = get(_fields, name, {})

            if (field._f)
              field._f.mount = false
            ;(_options.shouldUnregister || options.shouldUnregister)
            && !(isNameInFieldArray(_names.array, name) && _stateFlags.action)
            && _names.unMount.add(name)
          }
        },
        value,
        min,
        max,
        required,
        disabled,
        ...fieldPropValues,
      }
    },
    // Higher order function: onSubmit (Use Code) => onSubmit (Bind to Form Element).
    handleSubmit: (onSubmit) => {
      return (event: SubmitEvent) => {
        onSubmit(this._getFormData())
      }
    },
  }
}

function useForm() {
  // Detailed logic handlers: DOM refs, field getter/setter, submit handler.
  const formControlRef = useRef<FormControl>(createFormControl())
  // Entire form state: valid, errors etc.
  const formState = useState<FormState>()

  return {
    ...formControlRef.current,
  }
}

export default function App() {
  const { register, handleSubmit } = useForm()
  const onSubmit = data => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} type="text" />
      <input {...register('password')} type="password" />
    </form>
  )
}
```
