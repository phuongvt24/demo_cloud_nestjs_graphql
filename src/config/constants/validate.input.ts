export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum Status {
  DONE = 'Done',
  PENDING = 'Pending',
  DOING = 'Doing',
}

export enum RoleCode {
  OWNER = 'Owner',
  EDITOR = 'Editor',
  VIEWER = 'Viewer',
}

export const PASSWORD_FORMAT = {
  PASSWORD_REGEX:
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
  MESSAGE:
    'Password must be 8+ characters with 1 uppercase, 1 lowercase, 1 digit, and 1 special character.',
};

export const DATE_START = {
  MESSAGE: 'Start date must before end date',
};

export const PRIORITY_FORMAT = {
  ALOW_PRIORITY: Priority,
  MESSAGE: 'Priority must be in HIGH or MEDIUM or LOW',
};
