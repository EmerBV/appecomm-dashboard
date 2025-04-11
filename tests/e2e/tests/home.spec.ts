describe("The Home Page", () => {
	it("successfully loads", () => {
		cy.visit("/");
		cy.findByRole("heading", {
			name: /⚡⚛️ Vite React Template \(by EmerBV\)/i,
		}).should("exist");
	});
});
