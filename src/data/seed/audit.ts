import { AuditEntry } from '../../types';

export const initialAuditLogs: AuditEntry[] = [
  {
    id: 'aud_0012',
    timestamp: '12 Oct 2026 12:31',
    user: 'System (Scheduler)',
    action: 'Run Partial',
    target: 'run_20261012_1230_ar',
    before: 'Running',
    after: 'Partial (Source 429 backoff deferred)'
  },
  {
    id: 'aud_0011',
    timestamp: '11 Oct 2026 16:42',
    user: 'Owner',
    action: 'Send Test Email',
    target: 'owner@cadence.demo',
    before: 'Ready',
    after: 'Delivered (id: gmail-demo-4c91a7)'
  },
  {
    id: 'aud_0010',
    timestamp: '11 Oct 2026 03:10',
    user: 'Owner',
    action: 'Restore Verification',
    target: 'backup_20261011_0300.sqlite',
    before: 'Created',
    after: 'Verified ✓ (46 prospects, 212 evidence, 23 decisions)'
  },
  {
    id: 'aud_0009',
    timestamp: '11 Oct 2026 22:00',
    user: 'System (Scheduler)',
    action: 'Run Success',
    target: 'run_20261011_2200_co',
    before: 'Scheduled',
    after: 'Completed'
  },
  {
    id: 'aud_0008',
    timestamp: '09 Oct 2026 16:20',
    user: 'Owner',
    action: 'Manual IG Send',
    target: 'ar_0022 (Hoang Mirage)',
    before: 'Approved',
    after: 'Sent (Awaiting outcome)'
  },
  {
    id: 'aud_0007',
    timestamp: '08 Oct 2026 09:30',
    user: 'Owner',
    action: 'Update Cap',
    target: 'settings.dailyEmailCap',
    before: '20',
    after: '25'
  },
  {
    id: 'aud_0006',
    timestamp: '07 Oct 2026 11:30',
    user: 'Cloud Gate (Mock)',
    action: 'Cloud Review Decision',
    target: 'ar_0022 (Hoang Mirage)',
    before: 'Shortlisted',
    after: 'Contact (Approved)'
  },
  {
    id: 'aud_0005',
    timestamp: '07 Oct 2026 11:15',
    user: 'Cloud Gate (Mock)',
    action: 'Cloud Review Decision',
    target: 'co_0001 (Moonlit Harbor Records)',
    before: 'Shortlisted',
    after: 'Contact (Approved)'
  },
  {
    id: 'aud_0004',
    timestamp: '06 Oct 2026 15:20',
    user: 'Owner',
    action: 'Approve Template',
    target: 'artist_ig_intro v1',
    before: 'Draft',
    after: 'Approved'
  },
  {
    id: 'aud_0003',
    timestamp: '06 Oct 2026 15:15',
    user: 'Owner',
    action: 'Approve Template',
    target: 'sync_intro v1',
    before: 'Draft',
    after: 'Approved'
  },
  {
    id: 'aud_0002',
    timestamp: '06 Oct 2026 15:11',
    user: 'Owner',
    action: 'Approve Template',
    target: 'label_intro v2',
    before: 'Draft',
    after: 'Approved'
  },
  {
    id: 'aud_0001',
    timestamp: '03 Oct 2026 10:02',
    user: 'Owner',
    action: 'Suppress Prospect',
    target: 'co_0024 (Cedar Gate Sync)',
    before: 'Qualified',
    after: 'Suppressed (Owner manual directive)'
  }
];
