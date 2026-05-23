export const UserRole = {
    JobSeeker: 'job_seeker',
    Employer: 'employer',
    Admin: 'admin',
} as const;

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole];
