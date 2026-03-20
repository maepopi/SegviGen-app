import { useState, useRef } from 'react'
import { startJob, pollJob } from '../api/client'

export type JobStatus = 'idle' | 'running' | 'done' | 'error'

export function useJob<T = unknown>() {
  const [status, setStatus] = useState<JobStatus>('idle')
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  async function run(endpoint: string, params: Record<string, unknown>) {
    stop()
    setStatus('running')
    setResult(null)
    setError(null)

    let jobId: string
    try {
      jobId = await startJob(endpoint, params)
    } catch (e) {
      setStatus('error')
      setError(String(e))
      return
    }

    intervalRef.current = setInterval(async () => {
      const job = await pollJob(jobId)
      if (job.status === 'done') {
        stop()
        setStatus('done')
        setResult(job.result as T)
      } else if (job.status === 'error') {
        stop()
        setStatus('error')
        setError(job.error)
      }
    }, 1500)
  }

  return { status, result, error, run }
}
