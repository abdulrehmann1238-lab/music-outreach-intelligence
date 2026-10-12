import { SourceItem } from '../../types';

export const initialSources: SourceItem[] = [
  {
    id: 'src_01',
    name: 'Official company websites (direct fetch)',
    usedFor: 'Companies',
    accessCredentials: 'None required',
    termsAndLimits: 'Respect robots.txt, politeness delay, per-domain pacing',
    recurringCost: '$0',
    risk: 'Low',
    fallback: 'Cached evidence snapshot',
    notes: 'Primary source of truth for business registration, A&R submission inboxes, and roster claims. Verified in Python via httpx with custom User-Agent.',
    credentialOwner: 'None'
  },
  {
    id: 'src_02',
    name: 'Public web search (self-hosted metasearch)',
    usedFor: 'Both',
    accessCredentials: 'None required',
    termsAndLimits: 'Upstream search engines may rate-limit high-frequency queries',
    recurringCost: '$0',
    risk: 'Medium',
    fallback: 'Alternate engine rotation or cached index',
    notes: 'Used to locate official domains from Asian music industry press mentions. Does not leak prospect identities to cloud brokers.',
    credentialOwner: 'None'
  },
  {
    id: 'src_03',
    name: 'Commercial search API',
    usedFor: 'Both',
    accessCredentials: 'API key (owner-approved)',
    termsAndLimits: 'Per-query quota limits and commercial pricing',
    recurringCost: 'Needs approval',
    risk: 'Low',
    fallback: 'Self-hosted metasearch fallback',
    notes: 'Optional backup if self-hosted search is blocked. Never provisioned without explicit owner authorization.',
    credentialOwner: 'Owner'
  },
  {
    id: 'src_04',
    name: 'Streaming-platform metadata APIs',
    usedFor: 'Both',
    accessCredentials: 'Developer credentials (free tier)',
    termsAndLimits: 'Platform terms restrict non-player data hoarding; rate limited',
    recurringCost: '$0 (verify)',
    risk: 'Medium',
    fallback: 'Official label/artist release pages',
    notes: 'Used strictly to confirm release dates and follower metrics. Cache TTL 14 days.',
    credentialOwner: 'Owner'
  },
  {
    id: 'src_05',
    name: 'Video-platform data API',
    usedFor: 'Artists',
    accessCredentials: 'API key (free quota)',
    termsAndLimits: '10,000 daily quota units',
    recurringCost: '$0 within quota',
    risk: 'Medium',
    fallback: 'Direct web link parsing',
    notes: 'Validates live performance audio quality and vocal mix clarity.',
    credentialOwner: 'Owner'
  },
  {
    id: 'src_06',
    name: 'Open music database (MusicBrainz/Wikidata)',
    usedFor: 'Both',
    accessCredentials: 'None / custom User-Agent header',
    termsAndLimits: 'Strict 1 req/sec pacing policy',
    recurringCost: '$0',
    risk: 'Low',
    fallback: 'Primary label catalogs',
    notes: 'Provides canonical ISRC, barcode, and release date cross-referencing.',
    credentialOwner: 'None'
  },
  {
    id: 'src_07',
    name: 'Bandcamp / hobby platforms',
    usedFor: 'Companies',
    accessCredentials: 'None (public pages)',
    termsAndLimits: 'Public HTML parsing with pacing',
    recurringCost: '$0',
    risk: 'Low',
    fallback: 'None',
    notes: 'Primary trigger for Gate G9: identifying purely DIY/hobby entities to immediately suppress outreach.',
    credentialOwner: 'None'
  },
  {
    id: 'src_08',
    name: 'Instagram public profiles',
    usedFor: 'Artists',
    accessCredentials: 'None / Web inspection',
    termsAndLimits: 'Strict anti-automation policies. Automated scraping not assumed.',
    recurringCost: '$0',
    risk: 'High',
    fallback: 'Manual research queue',
    notes: 'Milestone 1 will rigorously test whether public metadata can be extracted without triggering anti-bot hurdles.',
    credentialOwner: 'None'
  },
  {
    id: 'src_09',
    name: 'Instagram messaging API',
    usedFor: 'Outreach',
    accessCredentials: 'Meta Business / Creator App Review required',
    termsAndLimits: 'Unsolicited cold automated DMs are likely prohibited by Meta Platform Terms',
    recurringCost: 'Requires verification',
    risk: 'High',
    fallback: 'Manual send queue (Guaranteed path)',
    notes: 'Core honesty constraint: Automation is marked Unverified. The manual review queue is built and tested as the guaranteed operational mechanism.',
    credentialOwner: 'Owner'
  },
  {
    id: 'src_10',
    name: 'Gmail API',
    usedFor: 'Outreach',
    accessCredentials: 'Owner Google OAuth (least-privilege scopes)',
    termsAndLimits: '500 messages/day consumer cap; batch pacing required',
    recurringCost: '$0',
    risk: 'Low',
    fallback: 'Manual email copy/paste',
    notes: 'Used only when Live Send switch is explicitly armed. Previews and dry-runs work completely without calling the live API.',
    credentialOwner: 'Owner'
  }
];
