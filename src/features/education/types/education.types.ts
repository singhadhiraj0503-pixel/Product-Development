import type {
  educationCohorts, educationTracks, educationWeeks, educationModules,
  educationLessons, educationProjects, educationApplications, educationEnrollments,
} from "@/lib/db/schema/education.schema";

export type EducationCohort = typeof educationCohorts.$inferSelect;
export type EducationTrack = typeof educationTracks.$inferSelect;
export type EducationWeek = typeof educationWeeks.$inferSelect;
export type EducationModule = typeof educationModules.$inferSelect;
export type EducationLesson = typeof educationLessons.$inferSelect;
export type EducationProject = typeof educationProjects.$inferSelect;
export type EducationApplication = typeof educationApplications.$inferSelect;
export type EducationEnrollment = typeof educationEnrollments.$inferSelect;

export type ApiSuccess<T> = { success: true; data: T; message?: string };
export type ApiFailure = { success: false; message: string; errors?: unknown };
