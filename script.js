// Paste your AWS Lambda Function URL between the quotes below.
// Example: https://xxxxxxxx.lambda-url.ap-south-1.on.aws/
const CONTACT_API_URL = "PASTE_YOUR_LAMBDA_FUNCTION_URL_HERE";

document.addEventListener("DOMContentLoaded", () => {
  // Typed.js animated role text
  const typedElement = document.getElementById("typed-text");
  if (typedElement && typeof Typed !== "undefined") {
    new Typed("#typed-text", {
      strings: ["Devops Engineer", "Cloud Engineer"],
      typeSpeed: 70,
      backSpeed: 45,
      backDelay: 1200,
      loop: true
    });
  } else if (typedElement) {
    typedElement.textContent = "Web Developer";
  }

  // Mobile navigation menu
  const menuButton = document.getElementById("menu-icon");
  const navbar = document.getElementById("navbar");
  if (menuButton && navbar) {
    menuButton.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.innerHTML = isOpen
        ? '<i class="bx bx-x"></i>'
        : '<i class="bx bx-menu"></i>';
    });
    navbar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.innerHTML = '<i class="bx bx-menu"></i>';
      });
    });
  }

  // Highlight the navigation item for the current section
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Contact form: sends name, email and message to the Lambda Function URL.
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (form) {
    form.addEventListener("submit", async event => {
      event.preventDefault();

      if (!CONTACT_API_URL || CONTACT_API_URL.includes("PASTE_YOUR_LAMBDA")) {
        if (status) status.textContent = "Please add your AWS Lambda Function URL in script.js first.";
        return;
      }

      const formData = new FormData(form);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        message: String(formData.get("message") || "").trim()
      };

      if (!payload.name || !payload.email || !payload.message) {
        if (status) status.textContent = "Please fill in all fields.";
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }
      if (status) status.textContent = "";

      try {
        const response = await fetch(CONTACT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Request failed (${response.status}). Check Lambda and CORS settings.`);
        }

        if (status) status.textContent = "Thanks! Your message was sent successfully.";
        form.reset();
      } catch (error) {
        console.error("Contact form submission error:", error);
        if (status) status.textContent = "Message could not be sent. Check the Lambda Function URL, CORS settings, and try again.";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Message";
        }
      }
    });
  }
});
