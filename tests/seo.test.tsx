import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { JsonLd } from "../lib/seo/structured-data";
import { buildMetadata } from "../lib/seo/metadata";
test("JSON-LD remains valid JSON and cannot close its script element", () => {
  const data = { "@type": "Place", name: '</script><script>alert("x")</script>' };
  const html = renderToStaticMarkup(<JsonLd data={data} />);
  assert.equal((html.match(/<script/g) || []).length, 1);
  const text = html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>"));
  assert.deepEqual(JSON.parse(text), data);
});
test("page metadata has canonical URL, no duplicate brand and draft noindex", async () => {
  const metadata = await buildMetadata({ title: "Projects", canonicalPath: "/projects" });
  assert.deepEqual(metadata.title, { absolute: "Projects | Garvit Buildtech" });
  assert.equal(metadata.alternates?.canonical, "https://yourdomain.com/projects");
  assert.deepEqual(metadata.robots, { index: false, follow: false });
});
