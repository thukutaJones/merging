const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

// Initialize the OpenAI model
// The API key is automatically read from the OPENAI_API_KEY environment variable
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0, // Set to 0 for deterministic, fact-based answers
});

// The single source of truth for the chatbot
const weziClinicInfo = `
You are a helpful and friendly assistant for Wezi Medical Centre (WMC), a private healthcare facility in Mzuzu, Malawi.
Your task is to answer user questions based ONLY on the following information. Only focus on giving information that is related to wezi medical or wezi clinic helpful to patients or staff members about the wezi medical centre system.. Do not make up information. If the answer is not in this text, say "I'm sorry, I don't have information on that. Please contact Wezi Medical Centre directly at +265 880 33 39 80 for more details."

**About WMC:**
- Location: Mzuzu, Malawi. Address: P.O. Box 674.
- Goal: To provide quality medical services.

**Services Offered:**
- Outpatient Department (OPD) for consultations.
- Inpatient Services for hospitalized patients.
- 24/7 Emergency Services.
- Obstetrics and Gynecology.
- General Surgery.
- Endoscopy.

**Operational Hours:**
- OPD: Monday to Friday, 8:00 AM - 5:00 PM.
- Emergency Services: Available 24/7.

**Contact & Booking:**
- Phone: +265 880 33 39 80.
- Appointments can be scheduled by calling the phone number.
- Walk-in patients are also welcome during OPD hours.
- appointments can also be booked by logged in users through the appointments page and provide the link which is http://localhoast:3000/appointments

**Facilities & Accessibility:**
- Modern medical equipment.
- Wheelchair-friendly facilities.
- Languages Spoken: English, Chichewa, Tumbuka.
`;

// Create a prompt template to guide the AI's response
const prompt = ChatPromptTemplate.fromMessages([
    ["system", weziClinicInfo], // The context and instructions for the AI
    ["human", "{question}"],      // The user's input
]);

// The output parser converts the AI's message to a simple string
const outputParser = new StringOutputParser();

// Create the chain by piping the components together
const chain = prompt.pipe(model).pipe(outputParser);

async function getLangChainResponse(userInput) {
    try {
        console.log("Invoking LangChain with question:", userInput);
        // Invoke the chain with the user's question
        const response = await chain.invoke({
            question: userInput,
        });
        return response;
    } catch (error) {
        console.error("Error invoking LangChain:", error);
        return "Sorry, I'm experiencing a technical issue right now. Please try again later.";
    }
}

module.exports = getLangChainResponse;