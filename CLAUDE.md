# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-tenant, multi-brand, multi-locale Next.js telco industry demo application showcasing HCL Digital+ CDP integration. The application supports multiple telecom brands (UniTel, Vodafone, Orange, T-Mobile) across multiple regions and languages with comprehensive customer tracking and personalization.

## Development Commands

### Local Development

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Operations

```bash
# Start shared PostgreSQL database (multi-tenant)
./manage-shared-db.sh start

# Check database status
./manage-shared-db.sh status

# View database logs
./manage-shared-db.sh logs

# Apply Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Restart database
./manage-shared-db.sh restart

# Stop database
./manage-shared-db.sh stop
```

### Docker Operations

```bash
# Deploy locally (includes database setup)
./deploy.sh local

# Rebuild and restart containers
npm run docker:rebuild

# View container logs
npm run docker:logs

# Check container status
npm run docker:ps

# Connect to database
npm run docker:db
```

### Deployment

```bash
# Deploy specific version to production
./server-deploy.sh <version-tag> production

# Simple deployment
./deploy-simple.sh
```

## Architecture

### Multi-Tenant Structure

- **Shared PostgreSQL Container**: `shared-postgres-multitenant`
- **Industry-Specific Databases**: `banking`, `insurance`, `telecom`
- **Container Network**: `multitenant-network`
- **Data Persistence**: Docker volumes for database storage

### URL Routing

All pages follow the pattern: `/{locale}/{brand}/{page}`

- Example: `/en-GB/vodafone/mobile-plans`
- Example: `/fr/orange/broadband`

### Brand & Locale System

**Supported Brands** (in `i18n/brands.ts`):

- `unitel` - UniTel (blue)
- `vodafone` - Vodafone (red)
- `orange` - Orange (orange)
- `tmobile` - T-Mobile (magenta)

**Supported Locales** (in `i18n/locales.ts`):

- English: `en`, `en-US`, `en-GB`, `en-AU`, `en-CA`, `en-IN`
- French: `fr`, `fr-CA`
- Spanish: `es`
- German: `de`
- Italian: `it`

Each locale includes currency information and fallback chains.

### Context System

**SiteContext** (`lib/SiteContext.tsx`):

- Manages current brand and locale
- Provides path helpers: `basePath`, `getFullPath()`, `getPageNamespace()`
- Accessed via `useSiteContext()` hook

**CDP Integration** (`components/CdpProvider.tsx`):

- Wraps application with HCL CDP tracking
- Supports brand-specific write key overrides via cookies
- Integrates with Google Analytics 4

## Internationalization (i18n)

### Critical i18n Rules

1. **NEVER use hard-coded strings** in components
2. **Always use translation hooks**: `const t = useTranslations('namespace')`
3. **For arrays/objects**: `const data = t.raw('path.to.data') as TypeName`
4. **All text must exist in language files**: `/language/*.json`
5. **Fallback system**: Each locale falls back according to `i18n/locales.ts` configuration

### Translation File Structure

- Base translations: `/language/en.json` (primary)
- Locale-specific: `/language/fr.json`, `/language/de.json`, etc.
- Brand-specific overrides: `/language/orange/en.json`, etc.

### Usage Pattern

```typescript
const t = useTranslations("planFinder")
const title = t("title")
const options = t.raw("options.international") as string[]
```

## CDP (Customer Data Platform) Integration

### Required Event Tracking

**Plan-Related Events**:

- `Plan_Acquire`: When plan page loads
- `Plan_Interest`: When customer status buttons clicked
- `Plan_Intent`: When "Choose Plan" buttons clicked
- `Plan_Convert`: When plan-only checkout completed

**Mobile Phone Events**:

- `MobilePhone_Acquire`: When mobile phones page loads
- `MobilePhone_Convert`: When phone checkout completed (with/without plan)

### CDP Event Structure

```typescript
track({
  identifier: "Plan_Interest",
  properties: {
    brand: brand.label,
    locale: locale.code,
    customerType: "new_customer",
    journeyStage: "consideration",
    pageSection: "mobile_plans",
    interaction: "customer_status_selection",
    timestamp: new Date().toISOString(),
  },
})
```

### Critical CDP Rules

1. **Use human-readable values**: Send actual text ("Good coverage needed"), NOT indices ("1")
2. **Differentiate product types**: `Plan_Convert` vs `MobilePhone_Convert`
3. **Retrieve text from translations**: Always use language files for dropdown values
4. **Track all user interactions**: Status changes, plan selections, checkouts

### Accessing CDP

```typescript
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
const { track, isCDPTrackingEnabled } = useCDPTracking()
```

## Key Components

### PlanFinder (`components/PlanFinder.tsx`)

- Intelligent plan recommendation engine
- Weighted scoring algorithm (Data: 30%, Minutes: 25%, SMS: 20%, International: 15%, Network: 10%)
- Supports 6 parameters: data usage, call minutes, SMS, international calling, network preference, payment preference
- Manual trigger pattern (user clicks "Find My Plan")
- Must be fully internationalized

### Price Formatting

Multiple utility modules handle pricing:

- `lib/priceFormatting.ts` - Main formatting logic
- `lib/brandCurrencyUtils.ts` - Brand-specific currency
- `lib/languagePriceUtils.ts` - Language-specific formatting
- `lib/currency.ts` - Currency utilities

Regional pricing must be appropriate for local markets.

### Cart System

- `components/CartIcon.tsx` - Cart display
- `components/AddToCartButton.tsx` - Add items to cart
- `components/CartSummary.tsx` - Cart summary display

## Database

### Schema (`prisma/schema.prisma`)

Single Customer model:

- Email-based authentication
- Supports bcrypt password hashing
- Multi-platform binary targets for Docker deployment

### Connection

```bash
DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/telecom
```

### Prisma Client (`lib/prisma.ts`)

Singleton pattern prevents multiple instances in development.

## Environment Configuration

### Required Environment Variables

```bash
# Industry Configuration
INDUSTRY_VERTICAL=telecom
DEPLOY_CONTAINER_PREFIX=telecom
DEPLOY_SITE_PORT=3002

# Database (multi-tenant)
DATABASE_URL=postgresql://multitenant_user:multitenant_password@shared-postgres-multitenant:5432/telecom

# CDP Integration
NEXT_PUBLIC_CDP_WRITEKEY=your_writekey
NEXT_PUBLIC_CDP_ENDPOINT=your_endpoint
NEXT_PUBLIC_INTERACT_ENDPOINT=your_interact_endpoint
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_DISCOVER_DEFAULT_SCRIPT=your_discover_script

# Application
NODE_ENV=development|production
```

See `.env.example` for complete configuration template.

## Code Standards

### Mandatory Patterns

1. **No hard-coded strings** - Use translations for all user-facing text
2. **CDP tracking** - Track all user interactions with proper event types
3. **useCallback for handlers** - Prevent unnecessary re-renders
4. **Manual triggers** - User-controlled actions, not automatic firing
5. **Regional believability** - Pricing, addresses, phone numbers must be regionally appropriate

### React Performance

- Use `useCallback` for event handlers
- Proper dependency arrays in hooks
- Avoid infinite loops in `useEffect`

### TypeScript

- Strict mode enabled
- Type all function parameters and returns
- Use interfaces for component props

### Import Paths

Use `@/` alias for imports:

```typescript
import { useSiteContext } from "@/lib/SiteContext"
import { Button } from "@/components/ui/button"
```

## Git Commit Standards

This project uses **Google's release-please** for automated version management and changelog generation via GitHub Actions. All commits MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

**Types that trigger releases:**

- `feat:` - New feature (triggers MINOR version bump)
- `fix:` - Bug fix (triggers PATCH version bump)
- `perf:` - Performance improvement (triggers PATCH version bump)

**Types that don't trigger releases:**

- `docs:` - Documentation changes only
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring without changing functionality
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks, dependency updates
- `ci:` - CI/CD configuration changes
- `build:` - Build system or external dependency changes

**Breaking changes:**

- Add `BREAKING CHANGE:` in footer OR append `!` after type/scope
- Triggers MAJOR version bump

### Examples

**Feature (minor version bump):**

```
feat: add plan recommendation filtering by network preference

Adds ability to filter recommended plans based on user's network preference (5G, 4G, etc.)
```

**Bug fix (patch version bump):**

```
fix: correct price formatting for Indian rupee locale

Fixes decimal separator issue in INR currency display
```

**Breaking change (major version bump):**

```
feat!: restructure CDP event tracking schema

BREAKING CHANGE: CDP event properties now require explicit journeyStage field. All custom tracking implementations must be updated.
```

**With scope:**

```
feat(mobile-plans): add upsell offers to checkout flow
fix(i18n): resolve German translation fallback issue
docs(readme): update deployment instructions
```

**Non-release commit:**

```
chore: update dependencies to latest versions
docs: add JSDoc comments to currency utilities
style: format code with prettier
```

### Critical Rules

1. **First line max 72 characters** - Keep commit titles concise
2. **Use imperative mood** - "add feature" not "added feature"
3. **Reference issues** - Include issue numbers in footer: `Closes #123`
4. **Breaking changes must be explicit** - Use `BREAKING CHANGE:` footer or `!` suffix
5. **Scopes are optional but recommended** - Use component/module names: `(mobile-plans)`, `(i18n)`, `(cdp)`

### Common Scopes

- `(mobile-plans)` - Mobile plan pages and components
- `(mobile-phones)` - Mobile phone catalog and details
- `(broadband)` - Broadband plans and bundles
- `(checkout)` - Checkout and cart functionality
- `(i18n)` - Internationalization and translations
- `(cdp)` - CDP tracking and integration
- `(ui)` - UI components and styling
- `(db)` - Database schema and migrations
- `(deploy)` - Deployment scripts and configuration

### Verification

Before committing:

1. Ensure commit message follows Conventional Commits format
2. Check that the type is appropriate for the change
3. Verify breaking changes are properly marked
4. Test that CI will correctly interpret the commit

### Automated Release Process

When commits are merged to `main`:

1. **release-please** analyzes commit messages
2. Determines next version based on commit types
3. Generates/updates CHANGELOG.md
4. Creates a release PR with version bump
5. When release PR is merged, creates a GitHub release with tag

## Regional Data Requirements

### Pricing by Region

- **US/Canada**: $20-$80 typical range
- **UK**: £15-£60 typical range
- **Germany/EU**: €18-€70 typical range
- **Australia**: $25-$90 typical range
- **India**: ₹300-₹2000 typical range

### Currency Formatting

- US: $29.99
- UK: £24.99
- Germany/France: 29,99 €
- India: ₹2,000

### Phone Number Formats

- US: (555) 123-4567
- UK: +44 20 7946 0958
- Germany: +49 30 12345678

## Common Pitfalls to Avoid

1. **Hard-coded text**: Always use translation functions
2. **Missing CDP events**: Track page loads, interactions, conversions
3. **Automatic firing**: Use manual triggers for user-controlled actions
4. **Non-readable CDP values**: Send text values, not numeric indices
5. **Missing dependency arrays**: Causes infinite loops
6. **Wrong conversion events**: Differentiate between Plan_Convert and MobilePhone_Convert

## Testing

- Test all language variations
- Verify CDP events fire correctly with proper data
- Test plan recommendation accuracy across all parameters
- Validate responsive design on mobile/tablet/desktop
- Test scroll functionality when plan finder triggers

## Deployment Architecture

### Bootstrap Pattern

`server-deploy.sh` (permanent) pulls latest `deploy.sh` from git repository, ensuring deployment scripts are always up-to-date.

### Directory Structure (Production)

```
/opt/telco-app/
├── server-deploy.sh (bootstrap script)
├── .env (server configuration)
├── current -> releases/v1.5.0/
└── releases/
    ├── v1.4.0/
    └── v1.5.0/
```

### Rollback

Deploy any previous version tag:

```bash
./server-deploy.sh v1.4.0 production
```

## Related Documentation

- **[Multi-Tenant Setup](SETUP_GUIDE.md)** - Database architecture details
- **[Server Deployment](SERVER_DEPLOYMENT.md)** - Production deployment guide
- **[Release Automation](RELEASE_AUTOMATION.md)** - Version management
- **[Copilot Instructions](.github/copilot-instructions.md)** - Comprehensive development guidelines
