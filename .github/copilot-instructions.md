# Copilot Instructions for Telco Industry Project

## Project Overview

This is a multi-tenant, internationalized Next.js telco industry application with comprehensive plan recommendation features, CDP tracking, and support for multiple brands and locales.

## Code Standards & Architecture

### 1. Internationalization (i18n) Requirements

- **NEVER use hard-coded strings** in React components - all text must use translation functions
- Use `useTranslations()` hook: `const t = useTranslations('namespace')`
- For arrays/objects, use `t.raw()`: `const options = t.raw('planFinder.options.international') as string[]`
- All user-facing text must be added to language files in `/language/` directory
- Support all languages: English (en.json), French (fr.json), German (de.json), Spanish (es.json), Italian (it.json)
- Use nested JSON structure for organized translations:
  ```json
  {
    "planFinder": {
      "labels": {
        "dataUsage": {
          "light": "Light usage (0-2GB)",
          "moderate": "Moderate usage (15GB)"
        }
      },
      "controls": {
        "hide": "Hide",
        "show": "Show"
      }
    }
  }
  ```

### 2. CDP (Customer Data Platform) Integration

- Always implement CDP tracking for user interactions
- Required events for plan-related features:
  - `Plan_Acquire`: Fired when plan page loads
  - `Plan_Interest`: Fired when customer status buttons are clicked
  - `Plan_Intent`: Fired when "Choose Plan" buttons are clicked
  - `Plan_Convert`: Fired when plan-only checkout is completed
- Required events for mobile phone features:
  - `MobilePhone_Acquire`: Fired when mobile phones page loads
  - `MobilePhone_Convert`: Fired when mobile phone checkout is completed (with or without plan)
- **Checkout conversion events must differentiate between product types**:
  - Use `Plan_Convert` for mobile plan-only purchases
  - Use `MobilePhone_Convert` for mobile phone purchases (with or without attached plan)
- **CDP properties must use human-readable values**:
  - Send actual text values for dropdown selections, not numeric indices
  - Example: "Good coverage needed" instead of "1"
  - Always retrieve text from language files when sending dropdown values
- Use proper CDP event structure with comprehensive data:
  ```typescript
  window.AdobeDataLayer?.push({
    event: "Plan_Interest",
    customer: {
      status: customerStatus,
      journey_stage: "consideration",
    },
    page: {
      section: "mobile_plans",
      interaction: "customer_status_selection",
    },
  })
  ```

### 3. React Performance Standards

- Use `useCallback` for event handlers to prevent unnecessary re-renders
- Implement manual trigger patterns instead of automatic firing for user-controlled actions
- Proper dependency arrays in hooks
- Avoid infinite loops in useEffect

### 4. Plan Recommendation System Standards

- Use weighted scoring algorithm for plan recommendations
- Support 6 parameters: data usage, call minutes, SMS, international calling, network preference, payment preference
- Implement intelligent payment preference logic (separate scoring for prepaid vs postpaid)
- Highlight recommended plans with green borders and "Recommended for You" badges
- Use slider controls with proper range labels and descriptions

### 5. UI/UX Patterns

- Card-based layouts for plan displays
- Responsive design with mobile-first approach
- Scroll functionality: when "Find My Plan" is clicked, scroll to show all plans
- Hide/Show toggles for optional features
- Manual trigger buttons for calculations instead of automatic firing
- Full-width layouts for customer status sections

### 6. File Organization

- Components in `/components/` directory
- Language files in `/language/` directory
- API routes in `/app/api/` directory
- Page components in `/app/[locale]/[brand]/` structure
- Utility functions in `/lib/` directory

### 7. Database & Schema

- Use Prisma ORM with schema in `/prisma/schema.prisma`
- Multi-tenant architecture support
- Proper database connection handling

### 8. Brand & Locale Support

- Support multiple brands and locales in routing: `/[locale]/[brand]/`
- Brand-specific configurations in `/i18n/brands.ts`
- Locale configurations in `/i18n/locales.ts`
- Use `getMessages()` and `getMetaData()` utilities for internationalization

## Specific Component Requirements

### General Page Requirements

- **All fictitious data must be regionally believable**:
  - Pricing appropriate for local markets and purchasing power
  - Contact information using proper regional formats
  - Addresses and locations that exist or sound plausible
  - Business hours reflecting local customs and time zones
  - Terms and conditions appropriate for regional regulations
- **Consistent branding across all pages**:
  - Logo placement and sizing standards
  - Color scheme adherence
  - Typography hierarchy
  - Button and UI element styling
- **Accessibility compliance**:
  - Proper ARIA labels and roles
  - Keyboard navigation support
  - Screen reader compatibility
  - Color contrast requirements

### PlanFinder Component

- Must be fully internationalized (no hard-coded strings)
- Include manual calculation triggers
- Support payment preference (prepaid/postpaid)
- Implement proper CDP tracking
- Use weighted scoring with these weights:
  - Data: 30%
  - Minutes: 25%
  - SMS: 20%
  - International: 15%
  - Network: 10%
- Consumer plans only (no business plans)

### Mobile Plans Page

- Load plan data from language files, not hard-coded
- Implement comprehensive CDP events
- Position PlanFinder above customer status
- Full-width customer status section
- Scroll functionality when plan finder is triggered

### Contact/Support Pages

- **Regional contact information**:
  - Local phone numbers with proper formatting
  - Regional support hours in local time zones
  - Appropriate escalation procedures for each market
- **Live chat and support channels**:
  - Language-appropriate support options
  - Regional business hours and availability

### Billing/Payment Pages

- **Regional payment methods**:
  - Credit/debit cards appropriate for region
  - Local payment services (PayPal, Apple Pay, Google Pay)
  - Bank transfer options where common (SEPA in EU)
- **Tax and regulatory compliance**:
  - VAT handling for EU markets
  - Sales tax for US markets
  - Appropriate tax display and calculation

### Legal/Terms Pages

- **Jurisdiction-specific legal language**:
  - Terms of service appropriate for local laws
  - Privacy policies compliant with regional requirements (GDPR, CCPA)
  - Dispute resolution procedures following local legal frameworks

## Code Quality Standards

- TypeScript strict mode
- Proper error handling
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- ESLint compliance
- Proper import/export structure

## Testing Requirements

- Test all language variations
- Verify CDP events fire correctly
- Test plan recommendation accuracy
- Validate responsive design
- Test scroll functionality

## Deployment Considerations

- Multi-tenant Docker support
- Environment-specific configurations
- Database migration handling
- CDN integration for assets

## Communication Standards

When implementing features:

1. Always check for existing internationalization patterns
2. Implement CDP tracking for all user interactions
3. Use manual triggers for user-controlled actions
4. Follow established component patterns
5. Test across all supported languages
6. Ensure responsive design works on all devices

## Language-Specific Considerations

- **English**: Primary language, most comprehensive translations
- **French**: Use Quebec French variants for Canadian markets (`fr-CA`)
- **German**: Use formal language appropriate for business context
- **Spanish**: Use neutral Spanish suitable for multiple markets
- **Italian**: Standard Italian with business-appropriate terminology

## Regional Data Localization Requirements

- **Pricing must be appropriate for regional markets**:
  - US/Canada: USD/CAD pricing ($20-$80 range typical)
  - UK: GBP pricing (£15-£60 range typical)
  - Germany: EUR pricing (€18-€70 range typical)
  - Australia: AUD pricing ($25-$90 range typical)
  - India: INR pricing (₹300-₹2000 range typical)
- **Currency formatting must follow local conventions**:
  - US: $29.99, UK: £24.99, Germany: 29,99 €, France: 29,99 €
- **Data allowances should reflect regional norms**:
  - Developed markets: Higher data allowances (50GB-unlimited common)
  - Emerging markets: More modest allowances with value focus
- **Phone numbers in examples must use proper regional formats**:
  - US: (555) 123-4567, UK: +44 20 7946 0958, Germany: +49 30 12345678
- **Addresses and postal codes must be regionally accurate**:
  - US: ZIP codes, UK: Postcodes, Germany: PLZ, Canada: Postal codes
- **Payment methods should reflect regional preferences**:
  - Include local payment options (SEPA, PayPal, local cards)
- **Legal and regulatory language must be appropriate**:
  - GDPR compliance for EU, different terms for different regions

## Common Patterns to Follow

- Always use translation hooks instead of hard-coded text
- Implement proper loading states for async operations
- Use consistent spacing and layout patterns
- Follow accessibility guidelines (a11y)
- Implement proper error boundaries
- Use semantic HTML elements
- Maintain consistent color schemes and branding

## Performance Guidelines

- Optimize bundle sizes
- Implement proper caching strategies
- Use Next.js best practices for SSR/SSG
- Minimize client-side JavaScript
- Optimize images and assets
- Implement proper SEO meta tags

Remember: This is a customer-facing telco application where user experience, performance, and internationalization are critical success factors. Always prioritize these aspects in any implementation.
