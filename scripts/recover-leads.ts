/** Operator tool. Dry-run by default; --send explicitly retries saved deliveries. */
import { readdir, readFile, rename } from "node:fs/promises";
import path from "node:path";
import { EmailSink, type LeadReceipt } from "../lib/lead/mailer";
import { StoredLeadSchema } from "../lib/lead/schema";
async function main() {
  const dir = process.env.LEAD_FAILURE_DIR;
  if (!dir) throw new Error("Set LEAD_FAILURE_DIR to the persistent private outbox");
  const names = (await readdir(dir)).filter(name => name.endsWith(".json"));
  console.log(`${names.length} saved request(s) await recovery.`);
  if (!process.argv.includes("--send")) { console.log("Dry run. Use --send only when SMTP is configured and delivery is intended."); return; }
  for (const name of names) {
    const record = JSON.parse(await readFile(path.join(dir, name), "utf8")) as { lead: unknown; receipt: LeadReceipt };
    const lead = StoredLeadSchema.parse(record.lead);
    const result = await new EmailSink().send(lead, record.receipt);
    if (result.accepted && result.delivery === "delivered") {
      await rename(path.join(dir, name), path.join(dir, `${name}.delivered`));
      console.log(`Delivered ${record.receipt.id}`);
    } else { console.error(`Still awaiting delivery: ${record.receipt.id}`); process.exitCode = 1; }
  }
}
main().catch(() => { console.error("Recovery stopped. Check SMTP, file permissions and saved record format."); process.exitCode = 1; });
