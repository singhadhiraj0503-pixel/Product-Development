CREATE TABLE "animal_appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"user_id" text,
	"pet_name" varchar(100) NOT NULL,
	"species" varchar(60) NOT NULL,
	"owner_name" varchar(140) NOT NULL,
	"owner_phone" varchar(30) NOT NULL,
	"owner_email" varchar(255),
	"appointment_at" timestamp with time zone NOT NULL,
	"reason" text,
	"status" varchar(30) DEFAULT 'requested' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_business_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_user_id" text,
	"facility_name" varchar(180) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"head_veterinarian" varchar(160) NOT NULL,
	"council_registration_no" varchar(100),
	"phone" varchar(30) NOT NULL,
	"email" varchar(255) NOT NULL,
	"address_line" text NOT NULL,
	"locality" varchar(120) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(12),
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(30) DEFAULT 'submitted' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "animal_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "animal_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "animal_provider_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_provider_corrections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid,
	"submitter_name" varchar(140) NOT NULL,
	"submitter_email" varchar(255),
	"relationship" varchar(60),
	"field_to_correct" varchar(100) NOT NULL,
	"current_value" text,
	"suggested_value" text NOT NULL,
	"reason" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_emergency_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"provider_id" uuid,
	"owner_name" varchar(140) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"pet_name" varchar(100),
	"species" varchar(60) NOT NULL,
	"symptoms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"status" varchar(30) DEFAULT 'received' NOT NULL,
	"is_demo_request" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_emergency_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid,
	"city" varchar(100) NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"label" varchar(140) NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"available" integer DEFAULT 0 NOT NULL,
	"blood_group" varchar(8),
	"is_demo_data" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(180) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"provider_type" varchar(40) NOT NULL,
	"description" text,
	"phone" varchar(30) NOT NULL,
	"email" varchar(255),
	"website" text,
	"address_line" text NOT NULL,
	"locality" varchar(120) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(12),
	"country" varchar(80) DEFAULT 'India' NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"species" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"capabilities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"operating_hours" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"open_24_hours" boolean DEFAULT false NOT NULL,
	"is_emergency" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_status" varchar(30) DEFAULT 'pending' NOT NULL,
	"consultation_fee" numeric(10, 2),
	"average_rating" numeric(2, 1) DEFAULT '0' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"cover_image_url" text,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "animal_providers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "animal_veterinarians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"name" varchar(160) NOT NULL,
	"qualification" varchar(180),
	"specialty" varchar(120),
	"council_registration_no" varchar(100),
	"is_on_duty" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "animal_services_name_unique" UNIQUE("name"),
	CONSTRAINT "animal_services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "animal_provider_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"fee" numeric(10, 2),
	"is_available" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_provider_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"user_id" text,
	"reviewer_name" varchar(140) NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"cohort_id" uuid,
	"track_id" uuid,
	"full_name" varchar(180) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(40),
	"background" varchar(180),
	"experience_level" varchar(80),
	"motivation" text,
	"portfolio_url" text,
	"status" varchar(30) DEFAULT 'submitted' NOT NULL,
	"admin_notes" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_cohorts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(40) NOT NULL,
	"name" varchar(180) NOT NULL,
	"status" varchar(24) DEFAULT 'upcoming' NOT NULL,
	"start_date" date,
	"application_deadline" timestamp with time zone,
	"total_seats" integer DEFAULT 0 NOT NULL,
	"filled_seats" integer DEFAULT 0 NOT NULL,
	"timezone" varchar(80) DEFAULT 'Asia/Kolkata' NOT NULL,
	"summary" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "education_cohorts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "education_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"application_id" uuid,
	"cohort_id" uuid NOT NULL,
	"track_id" uuid NOT NULL,
	"full_name" varchar(180) NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(30) DEFAULT 'pending_payment' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" varchar(400) NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(100),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"title" varchar(220) NOT NULL,
	"summary" text,
	"lesson_type" varchar(40) DEFAULT 'lesson' NOT NULL,
	"duration_minutes" integer,
	"content" text,
	"resource_url" text,
	"github_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_preview" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_id" uuid NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(220) NOT NULL,
	"category" varchar(100),
	"summary" text NOT NULL,
	"description" text,
	"duration_hours" numeric(5, 1),
	"module_count_label" varchar(100),
	"code_sample_title" varchar(180),
	"code_sample_language" varchar(40),
	"code_sample" text,
	"outcomes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tools" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "education_modules_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"provider" varchar(40) NOT NULL,
	"provider_payment_id" varchar(220),
	"amount_cents" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"status" varchar(30) DEFAULT 'created' NOT NULL,
	"paid_at" timestamp with time zone,
	"raw_metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"project_code" varchar(40),
	"title" varchar(220) NOT NULL,
	"category" varchar(100),
	"summary" text NOT NULL,
	"description" text,
	"problem_statement" text,
	"image_url" text,
	"repository_url" text,
	"demo_url" text,
	"version" varchar(40),
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"learning_outcomes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "education_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_syllabus_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"full_name" varchar(180) NOT NULL,
	"email" varchar(255) NOT NULL,
	"background" varchar(160),
	"cohort_code" varchar(40),
	"consent_to_contact" boolean DEFAULT true NOT NULL,
	"source" varchar(100) DEFAULT 'education_landing_page',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_tech_stack" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" varchar(100),
	"description" text,
	"website_url" text,
	"icon_key" varchar(80),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	CONSTRAINT "education_tech_stack_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "education_testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" varchar(140) NOT NULL,
	"role_label" varchar(160),
	"cohort_label" varchar(80),
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"avatar_url" text,
	"outcome_label" varchar(180),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education_tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" varchar(160) NOT NULL,
	"audience" varchar(160),
	"description" text,
	"price_cents" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"billing_label" varchar(160),
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"badge" varchar(100),
	"is_recommended" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "education_tracks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_weeks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"week_number" integer NOT NULL,
	"title" varchar(180) NOT NULL,
	"focus" varchar(100),
	"summary" text NOT NULL,
	"outcomes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"milestone" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "animal_appointments" ADD CONSTRAINT "animal_appointments_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_provider_categories" ADD CONSTRAINT "animal_provider_categories_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_provider_categories" ADD CONSTRAINT "animal_provider_categories_category_id_animal_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."animal_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_provider_corrections" ADD CONSTRAINT "animal_provider_corrections_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_emergency_requests" ADD CONSTRAINT "animal_emergency_requests_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_emergency_resources" ADD CONSTRAINT "animal_emergency_resources_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_veterinarians" ADD CONSTRAINT "animal_veterinarians_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_provider_services" ADD CONSTRAINT "animal_provider_services_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_provider_services" ADD CONSTRAINT "animal_provider_services_service_id_animal_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."animal_services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_provider_reviews" ADD CONSTRAINT "animal_provider_reviews_provider_id_animal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."animal_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_applications" ADD CONSTRAINT "education_applications_cohort_id_education_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."education_cohorts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_applications" ADD CONSTRAINT "education_applications_track_id_education_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."education_tracks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_enrollments" ADD CONSTRAINT "education_enrollments_application_id_education_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."education_applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_enrollments" ADD CONSTRAINT "education_enrollments_cohort_id_education_cohorts_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."education_cohorts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_enrollments" ADD CONSTRAINT "education_enrollments_track_id_education_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."education_tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_lessons" ADD CONSTRAINT "education_lessons_module_id_education_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."education_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_modules" ADD CONSTRAINT "education_modules_week_id_education_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."education_weeks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_payments" ADD CONSTRAINT "education_payments_enrollment_id_education_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."education_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "animal_appointments_provider_date_idx" ON "animal_appointments" USING btree ("provider_id","appointment_at");--> statement-breakpoint
CREATE INDEX "animal_providers_city_idx" ON "animal_providers" USING btree ("city");--> statement-breakpoint
CREATE INDEX "animal_providers_status_idx" ON "animal_providers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "animal_providers_type_idx" ON "animal_providers" USING btree ("provider_type");--> statement-breakpoint
CREATE UNIQUE INDEX "animal_review_user_provider_unique" ON "animal_provider_reviews" USING btree ("user_id","provider_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "education_applications_user_idx" ON "education_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "education_applications_status_idx" ON "education_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "education_applications_email_idx" ON "education_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "education_cohorts_status_idx" ON "education_cohorts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "education_enrollments_user_idx" ON "education_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "education_enrollments_cohort_idx" ON "education_enrollments" USING btree ("cohort_id");--> statement-breakpoint
CREATE INDEX "education_lessons_module_idx" ON "education_lessons" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "education_modules_week_idx" ON "education_modules" USING btree ("week_id");--> statement-breakpoint
CREATE INDEX "education_payments_enrollment_idx" ON "education_payments" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "education_syllabus_leads_email_idx" ON "education_syllabus_leads" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "education_weeks_number_uq" ON "education_weeks" USING btree ("week_number");