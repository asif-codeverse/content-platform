# Pre-Deployment Verification Checklist

This smoke test serves as a rapid, post-deployment health check. It focuses on validating that critical paths are fully operational in the deployed environment.

**Target Duration**: < 30 minutes
**Tester Role**: Developer / QA Engineer
**Target Environment**: Production / Staging

---

## 1. Environment Verification

- [ ] **Backend Health**: Navigate to `/api/v1/health` and verify `status: "ok"` (MongoDB & Redis connected).
- [ ] **Swagger Documentation**: Access `/docs` and confirm the Swagger UI loads successfully without schema errors.
- [ ] **Frontend Accessibility**: Navigate to the public Next.js domain; ensure the application renders without React hydration errors.
- [ ] **Environment Variables**: Ensure production variables (Cloudinary, Brevo, JWT secrets) are properly injected.

## 2. Authentication & Onboarding

- [ ] **Registration**: Register a new user account.
- [ ] **Email Verification**: Receive the Brevo OTP email and successfully verify the account.
- [ ] **Login**: Authenticate with valid credentials; verify the JWT access token is stored in memory and the HttpOnly refresh cookie is set.
- [ ] **Forgot Password**: Trigger a password reset email.
- [ ] **Reset Password**: Use the received OTP to successfully change the password.
- [ ] **Token Rotation**: Wait 15 minutes (or trigger a manual refresh flow); verify a new access token and refresh cookie are returned seamlessly.
- [ ] **Logout**: Trigger logout; ensure the refresh cookie is successfully cleared from the browser.

## 3. Authorization & Security

- [ ] **Unauthorized State**: Attempt to hit a protected API directly without a token. Expect a `401 Unauthorized` response.
- [ ] **USER Restrictions**: Attempt to access the Editor Dashboard as a standard user. Expect a `403 Forbidden` response.
- [ ] **EDITOR Restrictions (ABAC)**: Attempt to edit another author's article. Expect a `403 Forbidden` response.
- [ ] **ADMIN Restrictions**: Verify full access to all pending reviews and global user management capabilities.

## 4. Editorial Workflow

- [ ] **Create Article**: Draft a new article successfully.
- [ ] **Rich Text Formatting**: Verify TipTap editor applies bold, lists, and headers correctly.
- [ ] **Image Upload**: Upload a media asset via the editor; confirm it renders and is successfully hosted on Cloudinary.
- [ ] **Save Draft**: Verify the article is saved with status `DRAFT` and is editable.
- [ ] **Submit for Review**: Transition the draft to `PENDING` state.
- [ ] **Publish Article** *(Admin)*: Transition the article to `PUBLISHED`; verify the global Redis cache invalidates correctly.
- [ ] **Reject Article** *(Admin)*: Transition a pending article to `REJECTED`; confirm author visibility and re-edit capability.
- [ ] **Delete Article**: Soft-delete an article; confirm it is immediately removed from public feeds.
- [ ] **View Counter**: Visit the published article; verify the background job successfully increments the view counter.

## 5. Content Discovery (Search)

- [ ] **Public Search**: Query an existing term; confirm published articles match via MongoDB full-text indexing.
- [ ] **Draft Isolation**: Query a term only present in a `DRAFT` or `PENDING` article; verify the article is safely hidden from public results.
- [ ] **Empty State**: Query an unmatched term; verify a graceful empty state UI instead of an error.
- [ ] **Pagination**: Query a broad term; verify offset pagination loads subsequent pages correctly and accurately displays total counts.

## 6. Dashboard Management

- [ ] **Statistics Load**: Confirm total views and article counts aggregate correctly upon dashboard initialization.
- [ ] **My Articles**: Confirm the list correctly displays the logged-in user's content with accurate statuses.
- [ ] **Pending Reviews** *(Admin)*: Verify the queue correctly aggregates `PENDING` articles from all authors.
- [ ] **User Management** *(Admin)*: Successfully upgrade a `USER` role to `EDITOR`, and downgrade an `EDITOR` to `USER`.
- [ ] **Navigation**: Confirm all protected dashboard sidebar links route properly without hard reloads.

## 7. Caching & Performance

- [ ] **Redis Cache Hit**: Reload the public article feed multiple times; verify subsequent requests have heavily reduced network latency.
- [ ] **Cache Invalidation**: Publish a new article; verify the public feed immediately reflects the new article without manual clearing.
- [ ] **ETags (304 Not Modified)**: Inspect browser network tabs on repeated article fetches; confirm the Express server returns HTTP `304 Not Modified` where applicable.
- [ ] **Media Delivery**: Confirm that Cloudinary serves optimized (e.g., WebP) formats based on browser support.

## 8. SEO & Discoverability

- [ ] **robots.txt**: Ensure `/robots.txt` loads and correctly directs / disallows crawlers.
- [ ] **sitemap.xml**: Ensure the dynamic Next.js sitemap includes active, published article slugs.
- [ ] **Metadata & Open Graph**: Inspect a public article; verify Open Graph (OG) tags and metadata titles are populated properly for Twitter/LinkedIn social sharing.

## 9. Responsive UI Integrity

- [ ] **Mobile Layout**: Confirm navigation bars collapse into hamburger menus and typography scales properly for small screens.
- [ ] **Tablet Layout**: Confirm grid layouts adjust column counts gracefully to prevent UI overlap.
- [ ] **Desktop Layout**: Confirm optimal whitespace, readable line lengths, and modal alignments on high-resolution displays.
