export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues {
  name: string
  email: string
  password: string
}

export interface AuthFormFieldState<TValues> {
  values: TValues
  errorMessage: string
  isSubmitting: boolean
}

export interface AuthSubmitResult {
  errorMessage: string | null
}
