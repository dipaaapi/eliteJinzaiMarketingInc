// Shared vocabularies for the portal. Labels are i18n keys like `portal.stage.<value>`.

// Pre-employment screening pipeline (applications).
export const STAGES = ['applied', 'screening', 'interview', 'hired', 'rejected'];
export const ACTIVE_STAGES = ['applied', 'screening', 'interview'];

// Documents from the company's applicant requirements. Diploma/TOR is only needed if the client asks.
export const REQUIREMENTS = ['resume', 'ids', 'nbi', 'barangay', 'diploma'];
export const REQUIRED_FOR_HIRE = ['resume', 'ids', 'nbi', 'barangay'];

export const CATEGORIES = ['frontline', 'backoffice', 'warehouse'];
export const EMPLOYMENT_TYPES = ['fulltime', 'parttime', 'seasonal'];

// Client manpower requests.
export const REQUEST_STATUSES = ['new', 'sourcing', 'partial', 'filled', 'cancelled'];

// Government benefits every deployed employee must be processed for.
export const BENEFITS = ['sss', 'philhealth', 'pagibig'];

// Who can do what. Registration offers only the non-admin roles.
export const ROLES = ['admin', 'applicant', 'client'];
export const SELF_SERVICE_ROLES = ['applicant', 'client'];

export function missingRequirements(application) {
  return REQUIRED_FOR_HIRE.filter((key) => !application.requirements?.[key]);
}

// Hours between "HH:MM" times, or null while still clocked in.
export function hoursWorked(entry) {
  if (!entry.timeIn || !entry.timeOut) return null;
  const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  return Math.max(0, (toMin(entry.timeOut) - toMin(entry.timeIn)) / 60);
}

export function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
