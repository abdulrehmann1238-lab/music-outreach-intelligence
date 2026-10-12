import { SuppressionEntry, DuplicateMerge } from '../../types';

export const initialSuppression: SuppressionEntry[] = [
  {
    id: 'sup_0001',
    type: 'domain',
    value: 'cedargate.example.cn',
    linkedProspectId: 'co_0024',
    prospectName: 'Cedar Gate Sync',
    reason: 'owner_request',
    note: 'Owner manual do-not-contact directive recorded during initial catalog audit.',
    addedBy: 'Owner',
    addedAt: '03 Oct 2026 10:02',
    source: 'Owner action'
  }
];

export const initialDuplicateMerges: DuplicateMerge[] = [
  {
    id: 'mrg_0001',
    sourceUrl: 'https://www.moonlitharbor.example.tw/en/',
    mergedIntoId: 'co_0001',
    prospectName: 'Moonlit Harbor Records',
    identityKey: 'domain:moonlitharbor.example.tw',
    normalisationRule: 'Strip www prefix, remove trailing slash, lowercase canonical domain',
    timestamp: '12 Oct 2026 12:02'
  },
  {
    id: 'mrg_0002',
    sourceUrl: 'https://moonlitharbor.example.tw?utm_source=pulsewire',
    mergedIntoId: 'co_0001',
    prospectName: 'Moonlit Harbor Records',
    identityKey: 'domain:moonlitharbor.example.tw',
    normalisationRule: 'Strip marketing UTM query params from URL',
    timestamp: '12 Oct 2026 12:03'
  },
  {
    id: 'mrg_0003',
    sourceUrl: 'https://www.soravale.example.jp/index.html',
    mergedIntoId: 'co_0002',
    prospectName: 'Sora Vale Music',
    identityKey: 'domain:soravale.example.jp',
    normalisationRule: 'Strip default file paths and www prefix',
    timestamp: '12 Oct 2026 11:41'
  },
  {
    id: 'mrg_0004',
    sourceUrl: 'https://instagram.example/ayla_verano_music',
    mergedIntoId: 'ar_0001',
    prospectName: 'Ayla Verano',
    identityKey: 'handle:ayla.verano',
    normalisationRule: 'Alias profile merged into canonical primary handle',
    timestamp: '12 Oct 2026 12:11'
  },
  {
    id: 'mrg_0005',
    sourceUrl: 'https://dalgonahill.example.kr/roster?ref=melon',
    mergedIntoId: 'co_0005',
    prospectName: 'Dalgona Hill Entertainment',
    identityKey: 'domain:dalgonahill.example.kr',
    normalisationRule: 'Strip referral tracking query parameters',
    timestamp: '12 Oct 2026 11:02'
  },
  {
    id: 'mrg_0006',
    sourceUrl: 'https://www.starlitpier.example.hk/',
    mergedIntoId: 'co_0006',
    prospectName: 'Starlit Pier Music',
    identityKey: 'domain:starlitpier.example.hk',
    normalisationRule: 'Strip www and trailing slash',
    timestamp: '12 Oct 2026 09:13'
  },
  {
    id: 'mrg_0007',
    sourceUrl: 'https://verdantdelta.example.vn/home',
    mergedIntoId: 'co_0007',
    prospectName: 'Verdant Delta Records',
    identityKey: 'domain:verdantdelta.example.vn',
    normalisationRule: 'Normalise root path alias',
    timestamp: '12 Oct 2026 09:21'
  },
  {
    id: 'mrg_0008',
    sourceUrl: 'https://tsukiframe.example.jp/en/catalog',
    mergedIntoId: 'co_0015',
    prospectName: 'Tsuki Frame Licensing',
    identityKey: 'domain:tsukiframe.example.jp',
    normalisationRule: 'Merge multilingual subpath into canonical corporate identity',
    timestamp: '12 Oct 2026 11:11'
  },
  {
    id: 'mrg_0009',
    sourceUrl: 'https://instagram.example/nikoardan',
    mergedIntoId: 'ar_0002',
    prospectName: 'Niko Ardan',
    identityKey: 'handle:nikoardan.music',
    normalisationRule: 'Secondary handle mapped to active primary artist profile',
    timestamp: '12 Oct 2026 11:31'
  },
  {
    id: 'mrg_0010',
    sourceUrl: 'https://crescentframe.example.sg/index.php',
    mergedIntoId: 'co_0019',
    prospectName: 'Crescent Frame Audio',
    identityKey: 'domain:crescentframe.example.sg',
    normalisationRule: 'Strip index extension',
    timestamp: '12 Oct 2026 11:13'
  },
  {
    id: 'mrg_0011',
    sourceUrl: 'https://www.lanterncut.example.kr',
    mergedIntoId: 'co_0016',
    prospectName: 'Lantern Cut Music Supervision',
    identityKey: 'domain:lanterncut.example.kr',
    normalisationRule: 'Strip www prefix',
    timestamp: '12 Oct 2026 11:11'
  },
  {
    id: 'mrg_0012',
    sourceUrl: 'https://instagram.example/jiwoohale_official',
    mergedIntoId: 'ar_0005',
    prospectName: 'Jiwoo Hale',
    identityKey: 'handle:jiwoo.hale',
    normalisationRule: 'Merged official vanity handle',
    timestamp: '12 Oct 2026 11:21'
  },
  {
    id: 'mrg_0013',
    sourceUrl: 'https://www.bluehouridol.example.jp',
    mergedIntoId: 'co_0010',
    prospectName: 'Bluehour Idol Works',
    identityKey: 'domain:bluehouridol.example.jp',
    normalisationRule: 'Strip www prefix',
    timestamp: '12 Oct 2026 11:06'
  },
  {
    id: 'mrg_0014',
    sourceUrl: 'https://beacontaipei.example.tw/about.html',
    mergedIntoId: 'co_0020',
    prospectName: 'Beacon Taipei Catalog',
    identityKey: 'domain:beacontaipei.example.tw',
    normalisationRule: 'Strip static page extension',
    timestamp: '12 Oct 2026 10:11'
  },
  {
    id: 'mrg_0015',
    sourceUrl: 'https://daturhen.example.ph',
    mergedIntoId: 'ar_0009',
    prospectName: 'Datu Rhen',
    identityKey: 'handle:daturhen',
    normalisationRule: 'Artist landing domain mapped to active IG persona',
    timestamp: '12 Oct 2026 11:26'
  }
];
