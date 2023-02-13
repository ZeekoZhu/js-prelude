const input = () => cy.get('input[aria-label="input"]').as('input');
const INVALID_INPUT = 'border-red-500';

const inputResult = () =>
  cy.get('span[aria-label="input result"]').as('inputResult');

function resetBtn() {
  return cy.get('button[aria-label="reset"]').as('resetBtn');
}

function submitBtn() {
  return cy.get('button[aria-label="submit"]').as('submitBtn');
}

describe('form-field validate on change', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:4400/iframe.html?args=&id=controladaptor--default&viewMode=story',
    );
  });
  it('should render initial value', () => {
    input().should('have.value', 'hello world');
    inputResult().should('contain.text', 'hello world');
  });
  it('should disable reset button', () => {
    resetBtn().should('be.disabled');
  });

  describe('change input to long text', () => {
    beforeEach(() => {
      input().clear().type('hello world hello world hello world');
    });

    it('should render new value', () => {
      input().should('have.value', 'hello world hello world hello world');
      inputResult().should(
        'contain.text',
        'hello world hello world hello world',
      );
    });
    it('should disable submit button', () => {
      submitBtn().should('be.disabled');
    });

    it('should enable reset button', () => {
      resetBtn().should('not.be.disabled');
    });

    describe('then reset form', () => {
      beforeEach(() => {
        resetBtn().click();
      });

      it('should render initial value', () => {
        input().should('have.value', 'hello world');
        inputResult().should('contain.text', 'hello world');
      });
      it('should enable submit button', () => {
        submitBtn().should('not.be.disabled');
      });
    });
  });

  describe('change input to short text', () => {
    beforeEach(() => {
      input().clear().type('hi');
    });
    it('should be invalid', () => {
      input().should('have.class', 'border-red-500');
    });
    it('should disable submit button', () => {
      cy.get('button[aria-label="submit"]').should('be.disabled');
    });
  });
});

describe('form-field validate on blur', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:4400/iframe.html?args=validateOnBlur:true;validateOnChange:false&id=controladaptor--default',
    );
    input().clear().type('hello world hello world hello world');
  });

  it('should render new value', () => {
    input().should('have.value', 'hello world hello world hello world');
    inputResult().should('contain.text', 'hello world hello world hello world');
  });

  it('should not render error', () => {
    input().should('not.have.class', INVALID_INPUT);
    submitBtn().should('not.be.disabled');
  });

  describe('then blur input', () => {
    beforeEach(() => {
      input().blur();
    });

    it('should render error', () => {
      input().should('have.class', INVALID_INPUT);
      submitBtn().should('be.disabled');
    });
  });
});
