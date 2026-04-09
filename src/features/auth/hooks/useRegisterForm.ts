import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

import { AUTH_ROUTES } from '../constants'
import { sanitizeRegisterValues, validateRegisterValues } from '../schema'
import { signUpWithEmailPassword } from '../services/auth-service'
import type { RegisterFormValues } from '../types'

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
}

export function useRegisterForm() {
  const navigate = useNavigate({ from: AUTH_ROUTES.register })
  const [values, setValues] = useState<RegisterFormValues>(initialValues)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setFieldValue(field: keyof RegisterFormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    const sanitizedValues = sanitizeRegisterValues(values)
    const validationError = validateRegisterValues(sanitizedValues)

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)

    const { error } = await signUpWithEmailPassword(
      sanitizedValues.email,
      sanitizedValues.password,
      sanitizedValues.name,
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
