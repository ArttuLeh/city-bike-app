describe('Navigation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/stations*', {
      fixture: 'stationsPage1.json',
    }).as('getStations');
    cy.visit('/');
  });

  it('shows home and navigates to Stations and Journeys', () => {
    // App bar buttons
    cy.contains('Home').should('be.visible');
    cy.get('#stations').click();
    cy.wait('@getStations');
    cy.contains('h2', 'Stations').should('be.visible');

    cy.get('#journeys').click();
    cy.intercept('GET', '**/api/journeys*', {
      fixture: 'journeysPage1.json',
    }).as('getJourneys');
    cy.wait('@getJourneys');
    cy.contains('h2', 'Journeys').should('be.visible');
  });
});
