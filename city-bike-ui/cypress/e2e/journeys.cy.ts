describe('Journeys flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/journeys*', { fixture: 'journeysPage1.json' }).as('getJourneys')
  })

  it('lists journeys and sorts', () => {
    cy.visit('/journeys')
    cy.wait('@getJourneys')
    cy.contains('h2', 'Journeys').should('be.visible')
    // Click sort label (Covered distance)
    cy.contains('th', 'Covered distance (km)').click()
    cy.intercept('GET', '**/api/journeys*', (req) => {
      expect(req.url).to.include('sortField=Covered_distance_m')
      expect(req.url).to.match(/sortOrder=(asc|desc)/)
      req.reply({ fixture: 'journeysPage1.json' })
    }).as('sortedJourneys')
    cy.wait('@sortedJourneys')
    cy.contains('td', 'Tenholantie').should('be.visible')
  })

  it('adds a new journey', () => {
    cy.visit('/add-journey')
    cy.contains('h2', 'Add New Journey').should('be.visible')

    cy.get('input[label="Departure Station ID"], input[aria-label="Departure Station ID"], input').eq(0).clear().type('107')
    cy.get('input').eq(1).clear().type('111')
    cy.get('input').eq(2).clear().type('Tenholantie')
    cy.get('input').eq(3).clear().type('Esterinportti')
    cy.get('input').eq(4).clear().type('1000')
    cy.get('input').eq(5).clear().type('300')

    cy.intercept('POST', '**/api/journeys', (req) => {
      req.reply({
        id: 999,
        ...req.body
      })
    }).as('postJourney')

    cy.contains('button', 'Create').click()
    cy.wait('@postJourney')
    // Should navigate back to journeys
    cy.get('input').type('Tenholantie') // simple check that we're in journeys page
    cy.url().should('include', '/journeys')
  })
})
