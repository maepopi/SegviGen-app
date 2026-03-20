export async function uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.path;
}
export function fileUrl(path) {
    return `/api/files?path=${encodeURIComponent(path)}`;
}
export function downloadFile(path, filename) {
    const a = document.createElement('a');
    a.href = fileUrl(path);
    a.download = filename;
    a.click();
}
export async function startJob(endpoint, params) {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const { job_id } = await res.json();
    return job_id;
}
export async function pollJob(jobId) {
    const res = await fetch(`/api/jobs/${jobId}`);
    return res.json();
}
export async function fetchPresets() {
    const [sampler, split] = await Promise.all([
        fetch('/api/presets/sampler').then(r => r.json()),
        fetch('/api/presets/split').then(r => r.json()),
    ]);
    return { sampler, split };
}
