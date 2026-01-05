import type { Rule } from '../types.js';

export const pciRules: Rule[] = [
  {
    id: 'RULE_PCI_001_NO_FULL_PAN_STORAGE',
    name: 'No full PAN storage',
    description: 'Systems must not retain full PAN values in clear text.',
    severity: 'CRITICAL',
    category: 'PCI',
  },
  {
    id: 'RULE_PCI_002_NO_CVV_STORAGE',
    name: 'No CVV storage',
    description: 'CVV and CVV2 must not be stored after authorization.',
    severity: 'CRITICAL',
    category: 'PCI',
  },
  {
    id: 'RULE_PCI_003_NO_PAN_IN_LOGS',
    name: 'No PAN in logs',
    description: 'PAN must not appear in system logs or free text.',
    severity: 'HIGH',
    category: 'PCI',
  },
  {
    id: 'RULE_PCI_004_SECURE_CHANNEL_REQUIRED',
    name: 'Secure channel required',
    description: 'Card data must be transported over secure channels (HTTPS).',
    severity: 'HIGH',
    category: 'PCI',
  },
  {
    id: 'RULE_PCI_005_PAN_LUHN_VALID',
    name: 'PAN Luhn validation',
    description: 'PANs should pass Luhn check to be considered valid card numbers.',
    severity: 'MEDIUM',
    category: 'PCI',
  },
  {
    id: 'RULE_PCI_006_PAN_MASKING_FORMAT',
    name: 'PAN masking format',
    description: 'PANs must be stored in a consistent masked format.',
    severity: 'MEDIUM',
    category: 'PCI',
  },
  {
    id: 'RULE_PCI_007_NO_CARDHOLDER_FULL_NAME',
    name: 'Avoid full cardholder name storage',
    description: 'Full cardholder names should not be stored in clear text where not required.',
    severity: 'LOW',
    category: 'PCI',
  },
  {
    id: 'RULE_PCI_008_AUDIT_TRAIL_REQUIRED',
    name: 'Audit trail required',
    description: 'A minimal audit trail (masked) must exist for payment operations.',
    severity: 'LOW',
    category: 'PCI',
  },
];

export const orgRules: Rule[] = [
  {
    id: 'RULE_ORG_001_RETENTION_POLICY',
    name: 'Retention policy enforcement',
    description: 'Data retention must follow organizational policy (default 90 days).',
    severity: 'MEDIUM',
    category: 'ORG',
    default_value: 90,
  },
  {
    id: 'RULE_ORG_002_CONSENT_FOR_PII',
    name: 'Consent for PII',
    description: 'Personal data processing requires explicit consent when applicable.',
    severity: 'HIGH',
    category: 'ORG',
  },
  {
    id: 'RULE_ORG_003_PRIVACY_NOTICE_REQUIRED',
    name: 'Privacy notice required',
    description: 'A privacy notice URL must be present for EU customers.',
    severity: 'LOW',
    category: 'ORG',
    eu_locations: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','UK'],
    default_url: 'https://example.com/privacy'
  },
];
