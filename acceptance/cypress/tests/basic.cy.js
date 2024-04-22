context('Basic Acceptance Tests', () => {
  describe('Text Block Tests', () => {
    beforeEach(() => {
      cy.intercept('GET', `/**/*?expand*`).as('content');
      cy.intercept('GET', '/**/Document').as('schema');

      // given a logged in editor and a page in edit mode
      cy.autologin();
      cy.createContent({
        contentType: 'Image',
        contentId: 'my-image',
        contentTitle: 'My Image',
      });
      cy.visit('/');
      cy.wait('@content');
    });

    it('As editor I can add a page with a banner block', function () {
      // when I add a page with a text block
      cy.get('#toolbar-add').click();
      cy.get('#toolbar-add-document').click();
      cy.get('.documentFirstHeading')
        .type('My Page')
        .get('.documentFirstHeading')
        .contains('My Page');

      cy.get('.slate-editor > div > p').click();
      cy.get('.text-slate-editor-inner > .ui > .icon').click();
      cy.get('[aria-label="Unfold Common blocks"]').click();
      cy.get('.ui.basic.icon.button.banner').click();
      cy.get(
        '.block > :nth-child(1) > :nth-child(1) > [tabindex="0"] > .message > center > .toolbar-inner > :nth-child(1) > .ui > .icon',
      ).click();
      cy.get('[title="/my-image (Image)"]').dblclick();
      cy.get('#field-alt').type('Plone');
      cy.get('#field-text').type('Plone 6');
      cy.get('#field-additionalText').type('Volto Banner');
      cy.get('#toolbar-save > .icon').click();
    });
  });
});
