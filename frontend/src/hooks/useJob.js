import { useState, useRef } from 'react';
import { startJob, pollJob } from '../api/client';
export function useJob() {
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    function stop() {
        if (intervalRef.current)
            clearInterval(intervalRef.current);
    }
    async function run(endpoint, params) {
        stop();
        setStatus('running');
        setResult(null);
        setError(null);
        let jobId;
        try {
            jobId = await startJob(endpoint, params);
        }
        catch (e) {
            setStatus('error');
            setError(String(e));
            return;
        }
        intervalRef.current = setInterval(async () => {
            const job = await pollJob(jobId);
            if (job.status === 'done') {
                stop();
                setStatus('done');
                setResult(job.result);
            }
            else if (job.status === 'error') {
                stop();
                setStatus('error');
                setError(job.error);
            }
        }, 1500);
    }
    return { status, result, error, run };
}
