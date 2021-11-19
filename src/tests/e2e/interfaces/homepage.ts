export interface IHomepage {
    visit(): IHomepage;
    renderButton(): IHomepage;
    fillTheAnswersUp(): Cypress.Chainable<string[]>;
    submitButton([]): IHomepage;
  }
  