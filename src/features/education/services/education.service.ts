import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  educationCohorts, educationTracks, educationWeeks, educationModules,
  educationLessons, educationProjects, educationTechStack,
  educationFaqs, educationTestimonials,
} from "@/lib/db/schema/education.schema";

export async function getOverviewData() {
  const [cohorts, tracks, weeks, projects, stack] = await Promise.all([
    db.select().from(educationCohorts).where(eq(educationCohorts.isPublished, true)).orderBy(asc(educationCohorts.startDate)),
    db.select().from(educationTracks).where(eq(educationTracks.isActive, true)).orderBy(asc(educationTracks.sortOrder)),
    db.select().from(educationWeeks).where(eq(educationWeeks.isPublished, true)).orderBy(asc(educationWeeks.sortOrder)),
    db.select().from(educationProjects).where(eq(educationProjects.isPublished, true)).orderBy(asc(educationProjects.sortOrder)).limit(4),
    db.select().from(educationTechStack).where(eq(educationTechStack.isPublished, true)).orderBy(asc(educationTechStack.sortOrder)),
  ]);
  const cohort = cohorts[0] ?? null;
  return {
    program: {
      title: "Build production AI applications, not just toy prompts.",
      durationWeeks: weeks.length,
      shippedProjects: projects.length,
      cohort,
      seatsRemaining: cohort ? Math.max(0, cohort.totalSeats - cohort.filledSeats) : 0,
    },
    cohorts, tracks, curriculumPreview: weeks, projects, technologyStack: stack,
  };
}

export async function getCurriculumData() {
  const weeks = await db.select().from(educationWeeks)
    .where(eq(educationWeeks.isPublished, true)).orderBy(asc(educationWeeks.sortOrder));
  const modules = await db.select().from(educationModules)
    .where(eq(educationModules.isPublished, true)).orderBy(asc(educationModules.sortOrder));
  const lessons = await db.select().from(educationLessons)
    .where(eq(educationLessons.isPublished, true)).orderBy(asc(educationLessons.sortOrder));

  return weeks.map((week) => ({
    ...week,
    modules: modules.filter((module) => module.weekId === week.id).map((module) => ({
      ...module,
      lessons: lessons.filter((lesson) => lesson.moduleId === module.id),
    })),
  }));
}

export async function getModuleBySlug(slug: string) {
  const [module] = await db.select().from(educationModules)
    .where(and(eq(educationModules.slug, slug), eq(educationModules.isPublished, true))).limit(1);
  if (!module) return null;
  const [week] = await db.select().from(educationWeeks).where(eq(educationWeeks.id, module.weekId)).limit(1);
  const lessons = await db.select().from(educationLessons)
    .where(and(eq(educationLessons.moduleId, module.id), eq(educationLessons.isPublished, true)))
    .orderBy(asc(educationLessons.sortOrder));
  return { ...module, week, lessons };
}

export async function getAdmissionsData() {
  const cohorts = await db.select().from(educationCohorts)
    .where(eq(educationCohorts.isPublished, true)).orderBy(asc(educationCohorts.startDate));
  const tracks = await db.select().from(educationTracks)
    .where(eq(educationTracks.isActive, true)).orderBy(asc(educationTracks.sortOrder));
  return {
    cohorts: cohorts.map((c) => ({ ...c, seatsRemaining: Math.max(0, c.totalSeats - c.filledSeats) })),
    tracks,
  };
}

export async function getFaqs() {
  return db.select().from(educationFaqs).where(eq(educationFaqs.isPublished, true)).orderBy(asc(educationFaqs.sortOrder));
}

export async function getTestimonials() {
  return db.select().from(educationTestimonials)
    .where(eq(educationTestimonials.isPublished, true)).orderBy(asc(educationTestimonials.sortOrder));
}

export async function getProjects() {
  return db.select().from(educationProjects).where(eq(educationProjects.isPublished, true)).orderBy(asc(educationProjects.sortOrder));
}

export async function getTechStack() {
  return db.select().from(educationTechStack).where(eq(educationTechStack.isPublished, true)).orderBy(asc(educationTechStack.sortOrder));
}
