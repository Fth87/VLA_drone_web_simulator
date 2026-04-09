import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

import { AUTH_ROUTES } from '../constants'
import { sanitizeLoginValues, validateLoginValues } from '../schema'
import { signInWithEmailPassword } from '../services/auth-service'
import type { LoginFormValues } from '../types'

const initialValues: LoginFormValues = {
  email: '',
  password: '',
}

export function useLoginForm() {
  const navigate = useNavigate({ from: AUTH_ROUTES.login })
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setFieldValue(field: keyof LoginFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    const sanitizedValues = sanitizeLoginValues(values)
    const validationError = validateLoginValues(sanitizedValues)

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)

    const { error } = await signInWithEmailPassword(
      sanitizedValues.email,
      sanitizedValues.password,
    )

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    navigate({ to: AUTH_ROUTES.home })
  }

  return {
    values,
    errorMessage,
    isSubmitting,
    handleSubmit,
    setFieldValue,
  }
}
