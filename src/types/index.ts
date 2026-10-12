export type ProspectType = 'label' | 'sync' | 'artist';

export type ProspectStatus =
  | 'qualified'
  | 'shortlisted'
  | 'approved'
  | 'replied'
  | 'needs_review'
  | 'held'
  | 'rejected'
  | 'suppressed';

export type EvidenceConfidence = 'high' | 'medium' | 'low';

export type ContactPath =
  | 'anr_email'
  | 'business_email'
  | 'sync_email'
  | 'supervisor_email'
  | 'catalog_email'
  | 'contact_form'
  | 'ig_manual'
  | 'none';

export interface Evidence {
  id: string;
  prospectId: string;
  type: 'website' | 'press' | 'release' | 'roster' | 'streaming' | 'contact' | 'social_post' | 'video';
  title: string;
  url: string;
  retrievedAt: string;
  activityDate: string;
  parseStatus: 'ok' | 'partial' | 'failed';
  snippet: string;
  supports: string[];
  isOriginal?: boolean;
  originalText?: string;
  translation?: string;
}

export interface ScoreComponent {
  id: string;
  name: string;
  defaultWeight: number;
  rawRatio: number; // e.g. 19/20 = 0.95
  evidenceIds: string[];
  isUnsupported?: boolean;
  unsupportedNote?: string;
}

export interface GateResult {
  id: string; // G1..G10
  name: string;
  passed: boolean;
  reason: string;
  evidenceIds?: string[];
}

export interface ServiceFitScore {
  service: 'production' | 'songwriting' | 'mixing' | 'mastering';
  score: number;
  type: 'explicit' | 'hypothesis';
  basis: string;
  whatWeSaw: string;
  whyItMatters: string;
  whatWeDontKnow: string;
  evidenceIds: string[];
}

export interface ProspectHistory {
  timestamp: string;
  action: string;
  note: string;
  user: string;
}

export interface Prospect {
  id: string;
  name: string;
  handle?: string;
  domain?: string;
  type: ProspectType;
  city: string;
  country: string;
  countryCode: string;
  genres: string[];
  score: number;
  status: ProspectStatus;
  evidenceConfidence: EvidenceConfidence;
  contactPath: ContactPath;
  contactValue?: string;
  lastActivityDate: string;
  scoreComponents: ScoreComponent[];
  gates: GateResult[];
  localModelRationale: string;
  schemaValidated: boolean;
  serviceFit?: Record<'production' | 'songwriting' | 'mixing' | 'mastering', ServiceFitScore>;
  cloudDecision?: {
    outcome: 'contact' | 'no_contact' | 'defer';
    rationale: string;
    timestamp?: string;
  };
  channel: 'email' | 'ig_manual' | 'none';
  history: ProspectHistory[];
  unsupportedClaimToggled?: boolean;
}

export interface Run {
  id: string;
  pipeline: 'companies' | 'artists';
  startedAt: string;
  duration: string;
  status: 'success' | 'partial' | 'failed' | 'running' | 'cancelled';
  isDryRun?: boolean;
  sourcesCount: number;
  candidatesFetched: number;
  newCandidates: number;
  mergedDuplicates: number;
  failedSources: number;
  logs: string[];
  failedSourceDetails?: {
    source: string;
    errorClass: string;
    retries: number;
    backoff: string;
  }[];
}

export interface SuppressionEntry {
  id: string;
  type: 'email' | 'domain' | 'ig_handle';
  value: string;
  linkedProspectId?: string;
  prospectName?: string;
  reason: 'owner_request' | 'unsubscribed' | 'bounced' | 'legal' | 'other';
  note: string;
  addedBy: string;
  addedAt: string;
  source: string;
}

export interface DuplicateMerge {
  id: string;
  sourceUrl: string;
  mergedIntoId: string;
  prospectName: string;
  identityKey: string;
  normalisationRule: string;
  timestamp: string;
}

export interface OutreachItem {
  id: string;
  timestamp: string;
  prospectId: string;
  prospectName: string;
  channel: 'email' | 'ig_manual';
  templateVersion: string;
  action: 'dry_run' | 'test' | 'live_send' | 'manual_send';
  result: 'delivered' | 'blocked' | 'uncertain' | 'replied' | 'pending' | 'failed';
  providerId?: string;
  idempotencyKey: string;
  outcome?: 'no_reply' | 'replied' | 'booked' | 'declined';
  replyText?: string;
  notes?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  before: string;
  after: string;
}

export interface SourceItem {
  id: string;
  name: string;
  usedFor: 'Companies' | 'Artists' | 'Both' | 'Outreach';
  accessCredentials: string;
  termsAndLimits: string;
  recurringCost: string;
  risk: 'Low' | 'Medium' | 'High';
  fallback: string;
  notes: string;
  credentialOwner: 'Owner' | 'Developer' | 'None';
}

export interface SettingsState {
  weights: {
    label: Record<string, number>;
    sync: Record<string, number>;
    artist: Record<string, number>;
  };
  thresholds: {
    highPriority: number;
    qualified: number;
    manualReview: number;
  };
  safety: {
    liveSendArmed: boolean;
    cloudReviewEnabled: boolean;
    cloudMonthlyCap: number;
    cloudRunCap: number;
    cloudReviewsThisMonth: number;
    processingPaused: boolean;
  };
  outreach: {
    dailyEmailCap: number;
    runEmailCap: number;
    emailsSentToday: number;
    pacingSeconds: number;
    bookingUrl: string;
    ownerEmail: string;
    ownerTimezone: string;
  };
}
