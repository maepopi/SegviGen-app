export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = await res.json()
  return data.path as string
}

export function fileUrl(path: string) {
  return `/api/files?path=${encodeURIComponent(path)}`
}

export function downloadFile(path: string, filename: string) {
  const a = document.createElement('a')
  a.href = fileUrl(path)
  a.download = filename
  a.click()
}

export async function startJob(endpoint: string, params: Record<string, unknown>): Promise<string> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const { job_id } = await res.json()
  return job_id as string
}

export async function pollJob(jobId: string): Promise<{ status: string; result: unknown; error: string | null }> {
  const res = await fetch(`/api/jobs/${jobId}`)
  return res.json()
}

export async function fetchPresets() {
  const [sampler, split] = await Promise.all([
    fetch('/api/presets/sampler').then(r => r.json()),
    fetch('/api/presets/split').then(r => r.json()),
  ])
  return { sampler, split }
}
