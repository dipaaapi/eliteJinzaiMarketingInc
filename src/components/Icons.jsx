// Small line icons used on the home page and dashboard. They inherit the text colour.
function Icon({ children, size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const RecruitIcon = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
    <path d="M19 8v6M16 11h6" />
  </Icon>
);

export const PlacementIcon = (props) => (
  <Icon {...props}>
    <path d="M3 10 12 4l9 6v10H3z" />
    <path d="M9 20v-6h6v6" />
    <path d="M3 10h18" />
  </Icon>
);

export const ConsultIcon = (props) => (
  <Icon {...props}>
    <path d="M4 19V5M4 19h16" />
    <path d="m7 15 4-4 3 3 5-6" />
    <path d="M16 8h3v3" />
  </Icon>
);

export const TrainingIcon = (props) => (
  <Icon {...props}>
    <path d="m2 9 10-5 10 5-10 5z" />
    <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
  </Icon>
);

export const MissionIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </Icon>
);

export const VisionIcon = (props) => (
  <Icon {...props}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const ValuesIcon = (props) => (
  <Icon {...props}>
    <path d="M12 21s-8-4.6-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.4-8 11-8 11z" />
  </Icon>
);

export const MapIcon = (props) => (
  <Icon {...props}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);

export const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const UsersIcon = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 13.8c2 .9 3.5 3 3.5 6.2" />
  </Icon>
);

export const ReceiptIcon = (props) => (
  <Icon {...props}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </Icon>
);

export const ScreeningIcon = (props) => (
  <Icon {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
    <path d="m7.8 10.6 1.9 1.9 3.6-3.6" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.7 2.7L16.5 9.5" />
  </Icon>
);

export const ShieldIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Icon>
);

export const PhoneIcon = (props) => (
  <Icon {...props}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </Icon>
);

export const BriefcaseIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
  </Icon>
);

export const BoxIcon = (props) => (
  <Icon {...props}>
    <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9z" />
    <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" />
  </Icon>
);

export const StoreIcon = (props) => (
  <Icon {...props}>
    <path d="M4 9.5 5.5 4h13L20 9.5" />
    <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
    <path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" />
  </Icon>
);

export const DocumentIcon = (props) => (
  <Icon {...props}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </Icon>
);

export const ExternalIcon = (props) => (
  <Icon {...props}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Icon>
);
