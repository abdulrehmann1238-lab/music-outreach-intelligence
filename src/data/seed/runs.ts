import { Run } from '../../types';

export const initialRuns: Run[] = [
  {
    id: 'run_20261012_1230_ar',
    pipeline: 'artists',
    startedAt: '12 Oct 2026 12:30',
    duration: '1m 42s',
    status: 'partial',
    sourcesCount: 5,
    candidatesFetched: 18,
    newCandidates: 2,
    mergedDuplicates: 1,
    failedSources: 1,
    logs: [
      '[12:30:00] Pipeline started for Artists (scheduled slot 12:30 UTC+8)',
      '[12:30:02] STAGE 1: DISCOVERY initiated across 5 registered sources',
      '[12:30:05] Source "Streaming-platform metadata API" OK: 6 candidates fetched',
      '[12:30:08] Source "Video-platform data API" OK: 5 candidates fetched',
      '[12:30:14] Source "Open music database" OK: 3 candidates fetched',
      '[12:30:18] Source "Public web search" OK: 4 candidates fetched',
      '[12:30:22] Source "Music-search provider": HTTP 429 Too Many Requests',
      '[12:30:24] Retry 1/3 after 2s backoff... HTTP 429 received',
      '[12:30:30] Retry 2/3 after 6s backoff... HTTP 429 received',
      '[12:30:48] Retry 3/3 after 18s backoff... HTTP 429 received. Source deferred safely to next run.',
      '[12:30:52] STAGE 2: EXTRACT & NORMALISE: 18 raw candidates processed. 1 duplicate merged via canonical handle rule.',
      '[12:31:10] STAGE 3: LOCAL QUALIFICATION (llama.cpp/Qwen): 2 candidates met qualification criteria.',
      '[12:31:42] Pipeline completed as PARTIAL. Successful results preserved; failed source scheduled for retry at 17:30.'
    ],
    failedSourceDetails: [
      {
        source: 'Music-search provider',
        errorClass: 'HTTP_429',
        retries: 3,
        backoff: '2s, 6s, 18s'
      }
    ]
  },
  {
    id: 'run_20261012_1200_co',
    pipeline: 'companies',
    startedAt: '12 Oct 2026 12:00',
    duration: '54s',
    status: 'success',
    sourcesCount: 6,
    candidatesFetched: 31,
    newCandidates: 3,
    mergedDuplicates: 2,
    failedSources: 0,
    logs: [
      '[12:00:00] Pipeline started for Companies (scheduled slot 12:00 UTC+8)',
      '[12:00:04] STAGE 1: DISCOVER: 6 sources polled cleanly (0 errors)',
      '[12:00:18] STAGE 2: EXTRACT: 31 raw candidates parsed. 2 duplicates merged via domain normalisation.',
      '[12:00:35] STAGE 3: LOCAL QUALIFICATION: 3 passed hard gates; 1 shortlisted for final cloud review.',
      '[12:00:54] Run completed with SUCCESS. Overlap lock released.'
    ]
  },
  {
    id: 'run_20261012_0730_ar',
    pipeline: 'artists',
    startedAt: '12 Oct 2026 07:30',
    duration: '48s',
    status: 'success',
    sourcesCount: 5,
    candidatesFetched: 14,
    newCandidates: 1,
    mergedDuplicates: 1,
    failedSources: 0,
    logs: [
      '[07:30:00] Scheduled run started for Artists',
      '[07:30:48] Run completed with SUCCESS'
    ]
  },
  {
    id: 'run_20261012_0700_co',
    pipeline: 'companies',
    startedAt: '12 Oct 2026 07:00',
    duration: '42s',
    status: 'success',
    sourcesCount: 6,
    candidatesFetched: 22,
    newCandidates: 2,
    mergedDuplicates: 1,
    failedSources: 0,
    logs: [
      '[07:00:00] Scheduled run started for Companies',
      '[07:00:42] Run completed with SUCCESS'
    ]
  },
  {
    id: 'run_20261011_2230_ar',
    pipeline: 'artists',
    startedAt: '11 Oct 2026 22:30',
    duration: '1m 15s',
    status: 'success',
    sourcesCount: 5,
    candidatesFetched: 16,
    newCandidates: 2,
    mergedDuplicates: 2,
    failedSources: 0,
    logs: [
      '[22:30:00] Scheduled run started for Artists',
      '[22:31:15] Run completed with SUCCESS'
    ]
  },
  {
    id: 'run_20261011_2200_co',
    pipeline: 'companies',
    startedAt: '11 Oct 2026 22:00',
    duration: '38s',
    status: 'success',
    sourcesCount: 6,
    candidatesFetched: 19,
    newCandidates: 1,
    mergedDuplicates: 1,
    failedSources: 0,
    logs: [
      '[22:00:00] Scheduled run started for Companies',
      '[22:00:38] Run completed with SUCCESS'
    ]
  },
  {
    id: 'run_20261011_1730_ar',
    pipeline: 'artists',
    startedAt: '11 Oct 2026 17:30',
    duration: '50s',
    status: 'success',
    sourcesCount: 5,
    candidatesFetched: 15,
    newCandidates: 2,
    mergedDuplicates: 0,
    failedSources: 0,
    logs: [
      '[17:30:00] Scheduled run started for Artists',
      '[17:30:50] Run completed with SUCCESS'
    ]
  },
  {
    id: 'run_20261011_1700_co',
    pipeline: 'companies',
    startedAt: '11 Oct 2026 17:00',
    duration: '45s',
    status: 'success',
    sourcesCount: 6,
    candidatesFetched: 24,
    newCandidates: 2,
    mergedDuplicates: 1,
    failedSources: 0,
    logs: [
      '[17:00:00] Scheduled run started for Companies',
      '[17:00:45] Run completed with SUCCESS'
    ]
  }
];
