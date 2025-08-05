import { defineConfig } from 'cypress';
import { nxE2EStorybookPreset } from '@nx/storybook/presets/cypress';

export default defineConfig({
  e2e: {
    ...nxE2EStorybookPreset(__dirname),
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
