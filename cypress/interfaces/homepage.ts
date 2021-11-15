export interface IHomepage {
    visit(): IHomepage;
    renderButton(): IHomepage;
    addArrays(): Cypress.Chainable<string[]>;
    submitButton([]): IHomepage;
  }
  