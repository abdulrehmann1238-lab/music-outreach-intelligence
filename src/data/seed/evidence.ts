import { Evidence } from '../../types';

export const initialEvidence: Evidence[] = [
  // Moonlit Harbor Records (co_0001)
  {
    id: 'ev_0001',
    prospectId: 'co_0001',
    type: 'website',
    title: 'Official website — Company profile',
    url: 'https://moonlitharbor.example.tw/about',
    retrievedAt: '12 Oct 2026 12:02',
    activityDate: '01 Jan 2026',
    parseStatus: 'ok',
    snippet: 'Moonlit Harbor is an independent music label established in 2019 in Taipei, focusing on contemporary C-pop and dance crossover productions.',
    supports: ['Commercial legitimacy']
  },
  {
    id: 'ev_0002',
    prospectId: 'co_0001',
    type: 'release',
    title: 'Single release "Glass Tide" by Lio Chen',
    url: 'https://moonlitharbor.example.tw/releases/glass-tide',
    retrievedAt: '12 Oct 2026 12:03',
    activityDate: '19 Sep 2026',
    parseStatus: 'ok',
    snippet: 'Catalog #MH-042: Lio Chen — Glass Tide (Single). Mastered and distributed by Moonlit Harbor Records. Release date: September 19, 2026.',
    supports: ['Recent activity', 'Genre fit']
  },
  {
    id: 'ev_0003',
    prospectId: 'co_0001',
    type: 'roster',
    title: 'Current Active Roster page',
    url: 'https://moonlitharbor.example.tw/roster',
    retrievedAt: '12 Oct 2026 12:04',
    activityDate: '15 Sep 2026',
    parseStatus: 'ok',
    snippet: 'Five signed active recording artists: Lio Chen, Wendy Hsu, Ember Project, Kaohsiung Night Drift, and The Taipei Duo. Three commercial releases in 2026.',
    supports: ['Roster/catalog', 'Genre fit']
  },
  {
    id: 'ev_0004',
    prospectId: 'co_0001',
    type: 'streaming',
    title: 'Label curated streaming profile',
    url: 'https://streaming.example/label/moonlit-harbor',
    retrievedAt: '12 Oct 2026 12:05',
    activityDate: '05 Oct 2026',
    parseStatus: 'ok',
    snippet: 'Official label catalog playlist has 38,400 monthly active listeners with consistent bi-weekly release schedule and verified publisher badge.',
    supports: ['Audience/industry footprint']
  },
  {
    id: 'ev_0005',
    prospectId: 'co_0001',
    type: 'contact',
    title: 'Contact & Submissions page',
    url: 'https://moonlitharbor.example.tw/contact',
    retrievedAt: '12 Oct 2026 12:05',
    activityDate: '10 Oct 2026',
    parseStatus: 'ok',
    snippet: 'Direct A&R submissions and production pitches: anr@moonlitharbor.example.tw. Managed by Head of A&R Marcus Lin.',
    supports: ['Contactability']
  },
  {
    id: 'ev_0006',
    prospectId: 'co_0001',
    type: 'press',
    title: 'Pulsewire Asia Industry Report',
    url: 'https://pulsewire.example.asia/news/2026-08-30-taiwan-producers',
    retrievedAt: '12 Oct 2026 12:06',
    activityDate: '30 Aug 2026',
    parseStatus: 'ok',
    snippet: 'Report details Moonlit Harbor Records co-production partnership with Seoul-based independent beatmaker collective, aiming at regional Asian synchronisation.',
    supports: ['Commercial legitimacy', 'International potential']
  },

  // Sora Vale Music (co_0002)
  {
    id: 'ev_0010',
    prospectId: 'co_0002',
    type: 'website',
    title: 'Company registry profile (JP)',
    url: 'https://soravale.example.jp/corporate',
    retrievedAt: '12 Oct 2026 11:40',
    activityDate: '10 Aug 2026',
    parseStatus: 'ok',
    snippet: 'Sora Vale Music Inc., Shibuya Tokyo. Specialises in idol pop, vocal arrangement, and digital production management.',
    supports: ['Commercial legitimacy'],
    isOriginal: true,
    originalText: 'ソラヴェイル・ミュージック株式会社。渋谷区神宮前。アイドルポップス、ボーカルアレンジ、制作マネジメント。',
    translation: 'Sora Vale Music Inc. Jingumae, Shibuya-ku. Idol pop, vocal arrangement, and production management.'
  },
  {
    id: 'ev_0011',
    prospectId: 'co_0002',
    type: 'release',
    title: 'Autumn 2026 Idol EP Announcement',
    url: 'https://soravale.example.jp/news/ep-autumn',
    retrievedAt: '12 Oct 2026 11:42',
    activityDate: '24 Sep 2026',
    parseStatus: 'ok',
    snippet: 'Scheduled release of mini-album "Starlight Corridor" featuring 4 new vocal tracks and 2 instrumentals.',
    supports: ['Recent activity', 'Roster/catalog']
  },

  // Paper Lantern Tapes (co_0003)
  {
    id: 'ev_0020',
    prospectId: 'co_0003',
    type: 'website',
    title: 'Bandcamp profile only',
    url: 'https://paperlanterntapes.example.bandcamp.com',
    retrievedAt: '12 Oct 2026 10:15',
    activityDate: '14 May 2026',
    parseStatus: 'ok',
    snippet: 'Hobbyist cassette run of 50 tapes. No corporate registration, no dedicated domain, no professional A&R channel.',
    supports: ['Genre fit']
  },

  // Tsuki Frame Licensing (co_0015)
  {
    id: 'ev_0030',
    prospectId: 'co_0015',
    type: 'website',
    title: 'Catalog & Showreel page',
    url: 'https://tsukiframe.example.jp/catalog',
    retrievedAt: '12 Oct 2026 11:10',
    activityDate: '15 Aug 2026',
    parseStatus: 'ok',
    snippet: 'Licensed 14 commercial cues for Japanese broadcast television and domestic cosmetics campaigns in Q2/Q3 2026. 9 registered roster composers.',
    supports: ['Commercial legitimacy', 'Recent activity', 'Roster/catalog']
  },
  {
    id: 'ev_0031',
    prospectId: 'co_0015',
    type: 'contact',
    title: 'Sync department direct contact',
    url: 'https://tsukiframe.example.jp/sync-inquiry',
    retrievedAt: '12 Oct 2026 11:12',
    activityDate: '01 Oct 2026',
    parseStatus: 'ok',
    snippet: 'Submissions accepted from international composers: sync@tsukiframe.example.jp. Quick turnaround for pop and synth-driven instrumentals.',
    supports: ['Contactability', 'International potential']
  },

  // Cedar Gate Sync (co_0024)
  {
    id: 'ev_0040',
    prospectId: 'co_0024',
    type: 'website',
    title: 'Company licensing overview',
    url: 'https://cedargate.example.cn/licensing',
    retrievedAt: '12 Oct 2026 09:30',
    activityDate: '20 Sep 2026',
    parseStatus: 'ok',
    snippet: 'Shenzhen audio production and advertising sync provider. High volume catalog.',
    supports: ['Commercial legitimacy', 'Recent activity']
  },

  // Ayla Verano (ar_0001)
  {
    id: 'ev_0100',
    prospectId: 'ar_0001',
    type: 'social_post',
    title: 'Instagram Post — Explicit EP producer search',
    url: 'https://instagram.example/ayla.verano/p/DAdf391',
    retrievedAt: '12 Oct 2026 12:10',
    activityDate: '28 Sep 2026',
    parseStatus: 'ok',
    snippet: '"Writing 4 new dance-pop songs for my upcoming self-funded EP. Looking for a producer who can bring polished modern percussion and punchy vocal production!"',
    supports: ['Evidence of service need', 'Recent activity']
  },
  {
    id: 'ev_0101',
    prospectId: 'ar_0001',
    type: 'streaming',
    title: 'Spotify Artist Profile',
    url: 'https://streaming.example/artist/ayla-verano',
    retrievedAt: '12 Oct 2026 12:12',
    activityDate: '15 Aug 2026',
    parseStatus: 'ok',
    snippet: '6 self-released original singles. 24,000 monthly listeners across Southeast Asia. Independent copyright credits on all masters.',
    supports: ['Artist legitimacy', 'Professional seriousness']
  },
  {
    id: 'ev_0102',
    prospectId: 'ar_0001',
    type: 'video',
    title: 'Studio acoustic live acoustic session',
    url: 'https://video.example/watch/ayla-vocal-unmix',
    retrievedAt: '12 Oct 2026 12:15',
    activityDate: '20 Sep 2026',
    parseStatus: 'ok',
    snippet: 'Live studio recording reveals strong vocal phrasing but uncompressed sibilance and unbalanced vocal level vs backing acoustic instrumentation.',
    supports: ['Evidence of service need']
  },

  // Hoang Mirage (ar_0022)
  {
    id: 'ev_0120',
    prospectId: 'ar_0022',
    type: 'social_post',
    title: 'Single announcement and studio snippet',
    url: 'https://instagram.example/hoang.mirage/p/C89x12',
    retrievedAt: '02 Oct 2026 14:00',
    activityDate: '28 Sep 2026',
    parseStatus: 'ok',
    snippet: 'Preview of upcoming V-pop dance track "Da Nang Lights". In need of mixing polish and punchy low-end punch.',
    supports: ['Recent activity', 'Evidence of service need']
  }
];
