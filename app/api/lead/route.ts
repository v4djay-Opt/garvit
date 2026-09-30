import { createLeadHandler } from "@/lib/lead/handler";
import { rateLimit } from "@/lib/lead/rate-limit";
import { sendLead } from "@/lib/lead/mailer";
import { getProjectBySlug } from "@/lib/content/repository";
export const runtime = "nodejs";
export const POST = createLeadHandler({ limit: rateLimit, send: sendLead, project: getProjectBySlug });
