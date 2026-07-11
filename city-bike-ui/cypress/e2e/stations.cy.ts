describe('Stations flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/stations*', {
      fixture: 'stationsPage1.json',
    }).as('getStations');
  });

  it('lists stations and opens a station detail', () => {
    cy.visit('/stations');
    cy.wait('@getStations');
    cy.contains('h2', 'Stations').should('be.visible');

    // Click first station link
    cy.get('a[href^="/station/"]').first().click();

    // Stub the station details call
    cy.intercept('GET', '**/station/*', { fixture: 'stationDetails.json' }).as(
      'getStation',
    );
    cy.contains('h2', 'Station informations').should('be.visible');
    cy.contains('Address').should('be.visible');
    cy.contains('Station ID').should('be.visible');
    cy.contains('Total number of journeys starting from the station').should(
      'be.visible',
    );
    cy.contains('Total number of journeys ending at the station').should(
      'be.visible',
    );
    cy.contains(
      'The average distance of a journey starting from the station (km)',
    ).should('be.visible');
    cy.contains(
      'The average distance of a journey ending at the station (km)',
    ).should('be.visible');
    cy.contains(
      'Top 5 most popular departure stations for journeys ending at the station',
    ).should('be.visible');
    cy.contains(
      'Top 5 most popular return stations for journeys starting from the station',
    ).should('be.visible');
  });

  it('searches stations', () => {
    cy.visit('/stations');
    cy.wait('@getStations');
    cy.get('#search').type('Tenholantie');
    // Expect another call with search param
    cy.intercept('GET', '**/api/stations*', (req) => {
      expect(req.url).to.include('search=Tenholantie');
      req.reply({ fixture: 'stationsPage1.json' });
    }).as('searchStations');
    cy.wait(3000);
    cy.contains('Tenholantie').should('be.visible');
  });

  it('adds a new station', () => {
    cy.visit('/add-station');
    cy.contains('h2', 'Add New Station').should('be.visible');

    cy.get('input[label="FID"], input').eq(0).clear().type('107');
    cy.get('input').eq(1).clear().type('Tenholantie');
    cy.get('input').eq(2).clear().type('Tenholantie 1');
    cy.get('input').eq(3).clear().type('Helsinki');
    cy.get('input').eq(3).clear().type('CityBike');
    cy.get('input').eq(4).clear().type('10');
    cy.get('input').eq(5).clear().type('20.1234');
    cy.get('input').eq(5).clear().type('60.1234');

    cy.intercept('POST', '**/api/stations', (req) => {
      req.reply({
        id: 999,
        ...req.body,
      });
    }).as('postStation');

    cy.contains('button', 'Create').click();
    cy.wait('@postStation');
    // Should navigate back to Stations
    cy.get('input').type('Tenholantie'); // simple check that we're in journeys page
    cy.url().should('include', '/stations');
  });
});
