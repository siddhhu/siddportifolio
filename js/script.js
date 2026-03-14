/**
 * Script for Siddharth's Portfolio
 * Handles Bot Interactions
 */

// --- Chatbot Logic ---
const chatWindow = document.getElementById('chatbot-window');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const emailForm = document.getElementById('email-form');
const defaultInput = document.getElementById('default-input');

// Open/Close Chat
function toggleChat() {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
}

// Ensure it can be called from nav
window.openChat = function () {
    if (!chatWindow.classList.contains('active')) {
        toggleChat();
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.innerHTML = text; // Allow HTML for bolding/links in bot replies
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Simple RAG Simulation
const knowledgeBase = [
    {
        keywords: ['hi', 'hello', 'hey'],
        response: "Hi there! I can tell you about Siddharth's GenAI systems, automation platform experience, or help you get in touch."
    },
    {
        keywords: ['pubmatic', 'deal troubleshooting', 'mcp'],
        response: "At PubMatic, Siddharth built a <strong>Deal Troubleshooting Agent</strong> using LangChain and Langfuse, and developed an <strong>MCP Server</strong> integrating over 20+ AI agents. He also built rigorous test frameworks for these agents using Pytest and DeepEval."
    },
    {
        keywords: ['skills', 'tech', 'stack', 'languages'],
        response: "He is an expert in <strong>Generative AI</strong> (LLM Agents, LangChain, MCP, DeepEval) as well as <strong>Quality Automation</strong> (Python, Pytest, Spark, AWS). He knows Python, Scala, REST APIs and advanced DevOps tools like Datadog and Splunk."
    },
    {
        keywords: ['zs', 'associates', 'performance', 'sdet', 'qa'],
        response: "At ZS Associates, he scaled application performance by 4x, built massive CI/CD pipelines in TeamCity, and performed heavily distributed ETL and database testing."
    },
    {
        keywords: ['award', 'achievements', 'innovation'],
        response: "He won the <strong>Innovation Award at PubMatic</strong> for his Agentic AI framework, and the Learning Champion Award at ZS Associates."
    },
    {
        keywords: ['notice period', 'joining time', 'how soon', 'join'],
        response: "Siddharth has a standard notice period, but the specifics can be discussed directly based on the opportunity. Would you like to send him a <strong>contact</strong> message to discuss?"
    },
    {
        keywords: ['relocation', 'relocate', 'move', 'location', 'willing to', 'open to'],
        response: "He is currently based in Pune, Maharashtra. He is generally open to discussing relocation for the right high-impact GenAI role. Feel free to type <strong>'contact'</strong> to reach out to him."
    },
    {
        keywords: ['salary', 'compensation', 'expectations', 'ctc'],
        response: "His compensation expectations are in line with market standards for a Senior Software Engineer specializing in Generative AI. He prioritizes technically challenging work and massive enterprise scale. Type <strong>'contact'</strong> to discuss terms."
    },
    {
        keywords: ['weakness', 'weaknesses', 'failure', 'improve on'],
        response: "Siddharth often dives extremely deep into performance bottlenecks (like analyzing a single database query plan for hours). To balance this, he strictly time-boxes his investigations and leverages AI agents (Vibe Coding) to maintain a massive 2x development velocity."
    },
    {
        keywords: ['strength', 'strengths', 'why hire', 'tell me about yourself'],
        response: "His biggest strength is his <strong>end-to-end perspective</strong>. He doesn't just build LLM pipelines; he builds the automated hallucination detection, the database pipelines, and the deployment CI/CD. He uses 'Vibe Coding' with Claude and GPT-4o to turn 8 hours of complex work into 4 hours of pure production shipment."
    },
    {
        keywords: ['vibe coding', 'vibe', 'fast', '10x', 'velocity'],
        response: "Siddharth actively uses 'Vibe Coding'—leveraging models like Claude 3.5 Sonnet and GPT-4o combined with deep software architecture knowledge—to rapidly orchestrate infrastructure. This lets him collapse full 8-hour engineering tasks into 4 hours."
    },
    {
        keywords: ['contact', 'email', 'hire', 'reach', 'message'],
        response: "I can forward a message directly to Siddharth for you. Just fill out the form below!",
        action: "show_email_form"
    }
];

function handleUserMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Show User message
    appendMessage(text, 'user');
    chatInput.value = '';

    // 2. Simulate typing delay
    setTimeout(() => {
        let bestMatch = null;
        let lowerText = text.toLowerCase();

        // 3. Find matching knowledge base entry
        for (let kb of knowledgeBase) {
            if (kb.keywords.some(kw => lowerText.includes(kw))) {
                bestMatch = kb;
                break;
            }
        }

        // 4. Default fallback
        if (!bestMatch) {
            bestMatch = {
                response: "That's a great question. While I am a simple automated assistant, Siddharth can give you the full details. Would you like to type <strong>'contact'</strong> to send him a message?"
            };
        }

        // 5. Bot replies
        appendMessage(bestMatch.response, 'bot');

        // 6. Trigger action if necessary
        if (bestMatch.action === "show_email_form") {
            defaultInput.style.display = 'none';
            emailForm.style.display = 'flex';
        }

    }, 600);
}

// --- Email Flow ---
function cancelEmail() {
    emailForm.style.display = 'none';
    defaultInput.style.display = 'flex';
    appendMessage("No problem. What else would you like to know?", 'bot');
}

function sendEmail() {
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const msg = document.getElementById('contact-msg').value;

    if (!name || !email || !phone || !msg) {
        alert("Please fill out all fields.");
        return;
    }

    // Change button text to indicate loading
    const btnSend = document.querySelector('.btn-send');
    const oldText = btnSend.innerText;
    btnSend.innerText = "Sending...";

    /* 
      We use standard AJAX to submit to the user's existing Formspree endpoint backend-less
      (https://formspree.io/xaydjonl) which keeps the email functionality intact without EmailJS keys.
    */
    fetch("https://formspree.io/xaydjonl", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            _replyto: email,
            phone: phone,
            message: msg
        })
    }).then(response => {
        if (response.ok) {
            // Success
            emailForm.style.display = 'none';
            defaultInput.style.display = 'flex';

            // Clear inputs
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-msg').value = '';

            appendMessage(`Thanks, ${name}! Your email has been forwarded to Siddharth directly. He will get back to you shortly.`, 'bot');
        } else {
            // Error
            alert("Oops! There was a problem sending your message. Please try again.");
        }
    }).catch(error => {
        alert("Oops! There was a problem sending your message.");
    }).finally(() => {
        btnSend.innerText = oldText;
    });
}

// --- Direct UI Contact Form Flow ---
document.addEventListener('DOMContentLoaded', () => {
    const uiForm = document.getElementById('main-contact-form');
    if (uiForm) {
        uiForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default redirect to formspree page

            const name = document.getElementById('ui-contact-name').value;
            const email = document.getElementById('ui-contact-email').value;
            const phone = document.getElementById('ui-contact-phone').value;
            const msg = document.getElementById('ui-contact-msg').value;
            const btnSubmit = document.getElementById('ui-contact-submit');
            const statusDiv = document.getElementById('ui-form-status');

            if (!name || !email || !phone || !msg) return;

            const oldText = btnSubmit.innerText;
            btnSubmit.innerText = "Sending...";
            btnSubmit.disabled = true;

            fetch("https://formspree.io/xaydjonl", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    _replyto: email,
                    phone: phone,
                    message: msg
                })
            }).then(response => {
                if (response.ok) {
                    // Success
                    document.getElementById('ui-contact-name').value = '';
                    document.getElementById('ui-contact-email').value = '';
                    document.getElementById('ui-contact-msg').value = '';

                    statusDiv.innerText = "Thanks! Your message has been sent successfully.";
                    statusDiv.style.color = "#10b981"; // Success green
                    statusDiv.style.display = "block";

                    setTimeout(() => { statusDiv.style.display = "none"; }, 5000);
                } else {
                    // Error
                    statusDiv.innerText = "Oops! There was a problem sending your message.";
                    statusDiv.style.color = "#ef4444"; // Error red
                    statusDiv.style.display = "block";
                }
            }).catch(error => {
                statusDiv.innerText = "Oops! There was a problem sending your message.";
                statusDiv.style.color = "#ef4444";
                statusDiv.style.display = "block";
            }).finally(() => {
                btnSubmit.innerText = oldText;
                btnSubmit.disabled = false;
            });
        });
    }
});

// --- GenAI Loader ---
const genAIFacts = [
    // 4 Facts about Siddharth's Work
    "Siddharth built an enterprise Deal Troubleshooting Agent using LangChain that autonomously diagnoses complex backend configuration faults.",
    "By deploying a robust Model Context Protocol (MCP) server, Siddharth successfully orchestrated tool-routing across 20+ specialized AI agents.",
    "Beyond just chaining LLMs, Siddharth implements 'LLM-as-a-Judge' using DeepEval to systematically evaluate and block AI hallucinations in production.",
    "At ZS Associates, Siddharth achieved a massive 4x application performance scaling by aggressively rewriting query plans and orchestrating CI/CD.",
    // Generic Facts
    "LangChain acts as an orchestrator, chaining together LLMs, memory, and external tools into autonomous agents.",
    "Vector databases store document embeddings as high-dimensional arrays, enabling semantic similarity searches for RAG systems.",
    "Vibe Coding leverages intelligent AI agents to rapidly iterate on complex software architectures, doubling development velocity.",
    "Apache Spark processes massive datasets across distributed clusters using highly resilient distributed datasets (RDDs).",
    "Robust ETL pipelines are the backbone of data engineering, ensuring data is clean, transformed, and ready for analytics or AI models.",
    "Effective backend architecture separates concerns into microservices, allowing independent scaling of databases, APIs, and worker nodes."
];

// --- Initialization & Scroll Animations (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle Preloader
    const loaderFact = document.getElementById('loader-fact');
    if (loaderFact) {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';

        // Pick a random fact
        const randomFact = genAIFacts[Math.floor(Math.random() * genAIFacts.length)];
        loaderFact.innerText = `Did you know? ${randomFact}`;

        // Hold for ~2.8 seconds (Optimal reading time)
        setTimeout(() => {
            const loaderOverlay = document.getElementById('genai-loader');
            if (loaderOverlay) {
                loaderOverlay.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scroll
            }
        }, 2800);
    }

    // 2. Intersection Observer (Scroll Animations)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements that should animate
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .section-title, .project-card, .skill-category, .timeline-item, .stat-card');

    animatedElements.forEach((el, index) => {
        if (!el.classList.contains('fade-up') && !el.classList.contains('fade-in')) {
            el.classList.add('fade-up');
            // Slight stagger effect for grid items
            if (el.classList.contains('project-card') || el.classList.contains('skill-category') || el.classList.contains('stat-card')) {
                const delay = (index % 3) * 0.15;
                el.style.transitionDelay = `${delay}s`;
            }
        }
        observer.observe(el);
    });
});
