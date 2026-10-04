import { useState } from 'react'

const KEY = 'socialflow_publish_passcode'

const read = () => {
  try {
    return sessionStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}

const write = (value) => {
  try {
    if (value) sessionStorage.setItem(KEY, value)
    else sessionStorage.removeItem(KEY)
  } catch {
    // storage unavailable: the passcode will simply be asked for again
  }
}

export function usePasscode() {
  const [saved, setSaved] = useState(read)
  const [typed, setTyped] = useState('')

  const forget = () => {
    write('')
    setSaved('')
  }
  const accept = (code) => {
    write(code)
    setSaved(code)
    setTyped('')
  }

  return { saved, typed, setTyped, code: saved || typed, accept, forget }
}