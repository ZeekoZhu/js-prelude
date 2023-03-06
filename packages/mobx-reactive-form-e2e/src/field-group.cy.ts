const storyPage =
  'http://localhost:4400/iframe.html?id=docs-examples--form-group&viewMode=story';
Cypress.SelectorPlayground.defaults({
  onElement: ($el) => {
    const name = $el.attr('name');
    if (name) {
      return `[name="${name}"]`;
    }
  },
});

describe('field group', () => {
  // available input control: name, age, email, password, select, checkbox,
  // radio, radio-group

  const inputName = () => cy.get('[name="name"]');
  const inputAge = () => cy.get('[name="age"]');
  const inputEmail = () => cy.get('[name="email"]');
  const inputPassword = () => cy.get('[name="password"]');
  const inputSelect = () => cy.get('[name="select"]');
  const inputCheckbox = () => cy.get('[name="checkbox"]');

  describe('can update field', () => {
    beforeEach(() => {
      cy.visit(storyPage);
    });
    it('can update age', () => {
      inputAge().clear().type('123');
      inputAge().should('have.value', '123');
    });
    it('can update name', () => {
      inputName().type('hello world');
      inputName().should('have.value', 'hello world');
    });

    it('can update email', () => {
      inputEmail().type('hello@example.com');
      inputEmail().should('have.value', 'hello@example.com');
    });
    it('can update password', () => {
      inputPassword().type('hello world');
      inputPassword().should('have.value', 'hello world');
    });
    it('can update select', () => {
      inputSelect().select('apple');
      inputSelect().should('have.value', 'apple');
    });
    it('can update checkbox', () => {
      inputCheckbox().check();
      inputCheckbox().should('be.checked');
    });
    it('can update radio', () => {
      cy.get('[aria-label="apple"]').check();
      cy.get('[aria-label="apple"]').should('be.checked');
    });
  });
  describe('can validate field', () => {
    beforeEach(() => {
      cy.visit(storyPage);
    });
    it('can validate name', () => {
      inputName().clear().type('hello world');
      inputName().should('have.class', 'input-error');
    });
  });
});
