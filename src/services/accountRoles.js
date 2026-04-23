export const ACCOUNT_ROLE = {
  reader: 'reader',
  writer: 'writer',
  admin: 'admin',
};

const ACCOUNT_ROLE_SET = new Set(Object.values(ACCOUNT_ROLE));

export function normalizeAccountRole(role, fallback = ACCOUNT_ROLE.reader) {
  return ACCOUNT_ROLE_SET.has(role) ? role : fallback;
}

export function canWritePostsForRole(role) {
  return [ACCOUNT_ROLE.writer, ACCOUNT_ROLE.admin].includes(role);
}

export function canEngageForRole(role) {
  return [ACCOUNT_ROLE.reader, ACCOUNT_ROLE.writer, ACCOUNT_ROLE.admin].includes(role);
}

export function getAccountLabel(role, fallback = 'Member') {
  const normalizedRole = normalizeAccountRole(role, null);

  if (!normalizedRole) return fallback;

  return normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
}
