export interface EmailTemplate {
  id: string;
  name: string;
  version: string;
  approvedDate: string;
  channel: 'email' | 'ig_manual';
  subject?: string;
  body: string;
}

export const initialTemplates: EmailTemplate[] = [
  {
    id: 'tpl_label_v2',
    name: 'Label Introduction',
    version: 'label_intro v2',
    approvedDate: '06 Oct 2026',
    channel: 'email',
    subject: '{first_release_title} — a production collaboration idea',
    body: `Hello {contact_name or "A&R team"},

I came across {label_name} through {evidence_source} and noticed {grounded_fact_with_date}. I work as a producer, songwriter and mixing/mastering engineer, mostly in {genres}.

If it would be useful, I'd be glad to share two reference tracks tailored to your upcoming roster releases. You can pick a time to talk here: {booking_url}

Best,
{owner_name}`
  },
  {
    id: 'tpl_sync_v1',
    name: 'Sync House Outreach',
    version: 'sync_intro v1',
    approvedDate: '06 Oct 2026',
    channel: 'email',
    subject: 'Catalog & bespoke cue submission — {label_name}',
    body: `Hello {contact_name or "Licensing team"},

I noticed {grounded_fact_with_date} through {evidence_source}. I produce commercial pop and electronic cues for television and trailer placements, specialising in {genres}.

Would you be open to hearing two private audition cues prepared for your current supervisor briefs? You can find a convenient slot here: {booking_url}

Best,
{owner_name}`
  },
  {
    id: 'tpl_artist_v1',
    name: 'Artist Instagram Pitch',
    version: 'artist_ig_intro v1',
    approvedDate: '06 Oct 2026',
    channel: 'ig_manual',
    body: `Hey {contact_name}! Came across your music via {evidence_source} and loved {grounded_fact_with_date}.

I produce and mix {genres} tracks. If you're exploring production or mixing partners for your upcoming project, I'd be glad to share two private reference tracks. You can check my calendar here if you ever want to chat: {booking_url}`
  }
];
