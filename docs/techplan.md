Technical Roadmap for Building the Lead Scoring & Data Management Program

PHASE 0: Project Setup & Environment
Development Environment & Tools:

Version Control: Initialize a Git repository (GitHub, GitLab, or Bitbucket).
Project Structure:
Backend: e.g., server/ for Python (FastAPI) or Node.js services.
Frontend: e.g., client/ for React or Vue.
Shared Modules: e.g., common/ for shared code like validation schemas, utility functions.
Package/Dependency Management: Pip/Poetry (Python) or npm/yarn (Node.js).
Containerization: Create a basic Dockerfile + docker-compose.yml to standardize local environment.
Core Environment Setup:

Database:
Select & install PostgreSQL locally (or use Docker).
Create initial DB schema placeholders.
Caching (Optional at this stage):
Install Redis locally (or in Docker) for caching & queue tasks.
Coding Standards & Linting:

Define project guidelines (e.g., ESLint for JavaScript/TypeScript, Black/Flake8 for Python).
Configure formatting and commit hooks (Husky, pre-commit).
PHASE 1: Database Modeling & Schema Design
Core Entities:

Lead (Property) Table:
id, property_address, city, state, zip, mailing_address (and related fields).
Timestamps: created_at, updated_at.
Tag Table (for reference data):
id, name (e.g., Foreclosure, Probate), base_score, expiration_days, etc.
Lead_Tag Linking Table (many-to-many):
id, lead_id, tag_id, assigned_at, expiration_at, status (active/expired).
Score Table or Column:
Option 1: Store score directly in the Lead table for quick queries.
Option 2: Maintain a separate table for historical scoring.
Indexes & Performance Considerations:

Lead: index on property_address for fast lookups.
Lead_Tag: composite index (lead_id, tag_id) for quick existence checks.
Score: if separate, index on lead_id.
Initial Migrations:

Generate & run the first migration (using Alembic/Flyway for Python or an equivalent Node.js tool).
PHASE 2: Data Ingestion & Normalization
Basic Import Endpoint:

API Route: /api/leads/import
Accepts CSV (or JSON) with property data (e.g., address, tags).
Parse & validate each record; handle duplicates by a consistent unique key (address or a composite).
Write records to DB.
Data Normalization:

Convert addresses to a standardized format (uppercase, remove punctuation).
Optionally integrate a basic address parser library (e.g., usaddress in Python) to split out city/state/zip properly.
Duplicate Handling:

If a lead with the same address already exists:
Update or merge data (configurable logic).
Or skip if data is identical.
PHASE 3: Tagging Logic & Initial Scoring
Tag Assignment Mechanism:

On data import or update, assign tags to the lead (Lead_Tag table).
Example: If CSV row indicates "Foreclosure," link lead_id → Foreclosure tag.
Expiration:

For each assigned tag, set expiration_at = assigned_at + expiration_days.
Store an is_expired or status flag to mark if tag is active/expired.
Scoring Engine (Core)

Scoring Logic:
Summation of active tag scores.
Adjust for date-based decay (e.g., after certain thresholds).
Implementation:
A function calculate_lead_score(lead_id):
Fetch active tags → sum up tag base scores → apply time-based modifications → return final score.
Store the final score in a lead.score column or a separate table.
Manual "Recalculate Scores":

API Endpoint: /api/leads/recalculate-scores
Implementation approach:
Run a queue/worker job or a background task (Celery for Python, Bull for Node.js).
Show real-time progress if desired (store progress in DB or Redis and poll from the frontend).
Testing:

Use a small dataset to confirm correct tag assignment & scoring outputs.
PHASE 4: Daily Automated Scoring Updates
Scheduler Setup:

Use cron or a job scheduler (e.g., Celery Beat in Python) to run nightly.
Each run:
For each lead: check assigned tags, update expired tags, recalculate final score.
Log results for debugging.
Performance Tuning:

Optimize queries:
Possibly chunk leads (batch processing).
Cache repeating calculations if necessary (e.g., redis-limiter).
Monitoring:

Set up basic logs or alerts for job completion/failures.
PHASE 5: Basic Frontend Implementation
Frontend Architecture:

Framework: React or Vue.
Folder Structure: /pages or /components for routes and UI components.
Lead Listing & Filtering:

Page: "All Leads"
Columns: address, tags, score, created_at.
Basic filters: by score (range), by tag, search by address.
Manual Score Recalculation UI:

Button Recalculate Scores Now.
Click triggers an API call → background job starts.
A small progress bar or status indicator (poll the API for status).
Tag Management UI:

Page/section to list all tags, base scores, expiration rules.
Admin can add or modify tags.
PHASE 6: Enhancing Tag Features
Auto-Expire & Rename Tags:

If a tag is past expiration_at, rename it Expired - <tag_name> or set status=EXPIRED.
Ensure the scoring logic excludes or reduces score from expired tags.
Address Verification:

Integrate USPS/SmartyStreets for address standardization.
On import, send each address to the API:
If verified, store a "verified_address" field + a "verified" boolean.
UI indicators for addresses that are unverified.
Absentee Logic:

Compare property_address vs. mailing_address (once verified).
Auto-assign "Absentee" tags accordingly (in-county, out-of-county, out-of-state).
Re-check each time an address is updated.

Enhanced Instance-Based Tag Expiration:

Implementation Detail: Each tag assignment (in the lead_tag table) has its own independent expiration timeline based on when it was applied to a property.
Database Fields:
  lead_tag.assigned_at: DateTime (when the tag was applied to a specific lead)
  lead_tag.expiration_at: DateTime (calculated from assigned_at + tag.expiration_days)
  lead_tag.is_expired: Boolean (flag to track expiration status)
Business Logic: Expiration is calculated per-instance, not globally for a tag type.

Smart Expiration Calculation:
Service Method: Create calculate_tag_expiration(lead_id, tag_id, assigned_date, expiration_days)
  Calculate expiration date: expiration_at = assigned_at + timedelta(days=expiration_days)
  Store both the expiration date and a boolean flag for quick queries
Implementation: Apply this logic during initial tag assignment.

Retroactive Expiration Updates:
API Endpoint: Create /api/tags/{tag_id}/update-expiration
  Parameters: new_expiration_days, apply_retroactively (boolean)
Backend Service: Implement update logic to modify tag settings and optionally update all existing assignments
  If apply_retroactively=true, recalculate expiration for all instances based on original assignment date
  Update expiration status if needed (reactivate expired tags if they should now be active)
  Trigger scoring updates for affected leads.

Tag Configuration UI Enhancement:
Frontend Component: Extend tag management interface with clear expiration settings
UI Element: Add toggle switch "Apply changes retroactively to existing assignments"
Visual feedback: Show count of tag assignments that would be affected by retroactive changes.

PHASE 7: Bulk Actions & Progress Visibility
Bulk Import Enhancements:

Show a progress bar or real-time status in the UI for large file uploads.
Possibly store job progress in Redis or DB (e.g., total records processed vs. total rows).
Bulk Tag Editing:

UI to select multiple leads → apply or remove a tag en masse.
Track progress for large operations.
DNAMA (Do Not Append Mailing Address):

Toggle field on leads with verified addresses.
If DNAMA = true, skip any future mailing address updates.

Tag Expiration UI and Monitoring:

Tag Status Visualization:
  UI Component: Enhanced tag status display showing original assignment date, expiration date, and status
  Visual indicator of time remaining before expiration.

Bulk Expiration Management:
  API Endpoint: /api/tags/bulk-update-expiration
  Frontend Feature: Multi-select tags to modify expiration settings in bulk
  Option: Toggle to apply changes retroactively to each selected tag.

Expiration Audit Trail:
  Database: Add audit logging for expiration changes (old value, new value, affected assignments)
  UI Component: History view of expiration setting changes.

Expiration Notifications:
  Feature: Optional notification when tags are about to expire
  Implementation: Daily check for tags expiring in the next X days
  UI: Banner or notification in the leads view highlighting soon-to-expire tags.

PHASE 8: Advanced Deal Tracking (Optional at This Stage)
(If deal tracking is required now, implement. Otherwise, can wait until the scoring is 100% stable.)

Deal Entity:
Table: deal: id, lead_id, contract_date, offer_date, close_date, status, profit, reason_died, etc.
Integration with Scoring:
Track final outcome → over time, adjust scoring weights if certain tags correlate strongly with closed deals.
PHASE 9: Performance & Load Testing
Load Tests:

Use tools like Locust (Python) or Artillery (Node.js) to simulate large imports and heavy queries.
Focus on concurrency, verifying the system can handle multiple imports simultaneously without significant slowdown.
Database Index Review:

Review query logs for slow queries.
Add or refine indexes (e.g., partial indexes for frequently queried subsets).
Caching:

If certain queries are repeated often (e.g., top 100 leads by score), cache those results in Redis with a short TTL (e.g., 30 seconds).
PHASE 10: Final UI Polishing & Extended Features
Enhanced Filters & Smart Lists:

Create dynamic saved filters ("Smart Lists"), e.g., "Score > 2000 & Tag = Foreclosure."
Provide a simple UI to build filter conditions (like a rule builder).
Offer quick list creation and one-click export (CSV, etc.).
Direct Mail / Marketing Integrations (If Required in Current Scope):

Basic triggers: For leads above a certain score, auto-send them to a direct mail queue.
Integrate with external printing/mailing APIs (e.g., Lob).
PHASE 11: QA, Staging & Production Deployment
Quality Assurance:

Automated testing: unit, integration, end-to-end tests.
Manual UI testing: confirm smooth workflows, no major UI/UX issues.
Staging Environment:

Deploy a staging instance matching production config (Docker + managed DB).
Migrate data, run tests, do final checks.
Production Deployment:

Provision necessary servers or containers (AWS, GCP, or Azure).
Deploy the containers (using e.g., Docker Swarm, Kubernetes, or a PaaS like Heroku).
Set up a continuous integration/continuous deployment (CI/CD) pipeline.
PHASE 12: Maintenance & Iteration
Monitoring & Alerts:

Set up logs and metrics (Grafana, ELK stack, or DataDog).
Real-time error notifications (Sentry or similar).
Bug Fixes & Patches:

Ongoing resolution of discovered issues.
Maintain an agile board with feature requests and backlog.
Future Enhancements:

Integrate additional data sources or advanced AI/ML for lead scoring.
Expand tagging logic based on new user requirements (e.g., specialized local data or events).
Key Technical Considerations Throughout
Data Integrity

Strict validations on address fields, tag assignments, etc.
Clear rules for handling duplicates.
Scoring Accuracy

Detailed logs for how each lead's score is calculated at each step.
Build debug endpoints or logs to verify correctness.
Scalability

Database partitioning or sharding if needed.
Horizontal scaling for large imports (e.g., queue system with multiple worker nodes).
Extensibility

Modular approach: Tag system, Scoring system, Deal system each in its own domain layer.
Keep business logic in the backend services, so the frontend remains flexible.