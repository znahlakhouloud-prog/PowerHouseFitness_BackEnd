/*
 * Mock contact service - no backend endpoint exists yet. Simulates
 * a network round trip so the form's loading/success states behave
 * realistically. Swap the body of this function for a real
 * `api.post("/contact", data)` once a backend route exists; the
 * calling code in Contact.jsx doesn't need to change.
 */
export const sendContactMessage = async (data) => {

    await new Promise((resolve) => setTimeout(resolve, 900));

    console.log("Contact form submitted (mock):", data);

    return { message: "Message sent successfully" };

};
