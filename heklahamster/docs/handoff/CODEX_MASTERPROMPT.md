# CODEX MASTERPROMPT — HEKLAHAMSTER.NO

Build a production-ready Norwegian boutique ecommerce website based on the attached working static prototype (`index.html` + `assets/`). Preserve the editorial art direction: warm cream, dusty pink, charcoal, Fraunces/DM Sans, premium independent-agency execution. No generic AI gradients, stock imagery, fake reviews or boilerplate.

## Brand and products
Four products: Langhamsteren, Skjevehamsteren, Bustehamsteren, Fetthamsteren. Intentional ugly handmade crochet appearance, lightly suggestive but still unmistakably absurd hamsters. The images in `assets/` are AI concept references, not photographs of manufactured products. Never claim actual stock or production quality based on them. Prices 244 NOK are placeholders until approved.

## Implementation
Use Next.js App Router, TypeScript, Tailwind, Vercel hosting, Supabase Postgres/Storage/Auth for admin, and Stripe or Vipps subject to merchant approval. Build mobile-first, responsive, accessible, fast, Norwegian copy. Preserve user-facing product selection and live embroidery preview (max 20 Unicode characters, validate server-side). Support unique gift orders with recipient delivery address, sender privacy preferences, and personalized greeting text, audio recording/upload or video upload. Use signed uploads, size/type/duration limits, malware scanning strategy, moderation/abuse reports, retention and deletion controls. Every gift gets a cryptographically random private greeting token, no indexing, and no recipient exposure of sender identity unless authorized. Note: unguessable URLs are bearer secrets; consider optional PIN for sensitive messages.

## Checkout and operations
Create server-validated order draft -> secure payment checkout -> webhook-confirmed paid order -> admin production queue -> embroidery instructions -> QR label generation -> shipment tracking. Do not mark paid before verified webhook. Never expose private shipping details or greetings in client bundles. Provide Norwegian legal pages and placeholders for business information pending real data. Make it easy to operate orders without programming.

## AI commerce
Expose public structured Product JSON-LD and catalog feed. Implement authenticated, rate-limited API for catalog, configuration validation and order-draft creation, returning customer-confirmed checkout URL. Do not assume ChatGPT can natively transact; support assisted checkout first. Document API in OpenAPI and add integration tests.

## Quality gate
Audit prototype and implement in small, testable commits. Run typecheck, lint, unit tests and Playwright mobile end-to-end flows. Verify keyboard navigation, contrast, privacy, upload limits, webhooks and error handling. Never fabricate integrations, payments, reviews or inventory. Keep feature flags for unfinished functionality. Prepare README, .env.example, architecture diagram, Supabase migrations and Vercel deployment instructions. Do not deploy or charge money without explicit approval.

## Assets and handoff
Use the bundled image assets by filename; do not rely on an unverified Google Drive link. Optimize images. The four hamsters must remain visually consistent across collection, detail and campaign sections. Replace concept images with approved production photos before selling. First deliver a functioning local preview and a checklist of missing secrets/services.
