import { useEffect, useState } from 'react'

export function useTypewriter(text, speed = 38, startDelay = 600) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    let interval
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval)
            return c
          }
          return c + 1
        })
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed: text.slice(0, count), done: count >= text.length }
}
