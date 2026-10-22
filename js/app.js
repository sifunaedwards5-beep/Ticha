

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const modal = $("#auth-modal");
  const authForm = $("#auth-form");
  let authMode = "signup";
  let answered = false;
  let answerCorrect = false;

  $("#year").textContent = new Date().getFullYear();

  function scrollToDemo() {
    $("#demo").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("#try-demo").addEventListener("click", scrollToDemo);

  function resetDemo() {
    answered = false;
    answerCorrect = false;
    $("#demo-content").classList.remove("hidden");
    $("#demo-result").classList.add("hidden");
    $("#demo-progress-fill").style.width = "45%";
    $("#answer-feedback").textContent = "Choose an answer to see your feedback.";
    $("#answer-feedback").className = "answer-feedback";
    $$(".answer-option").forEach(button => {
      button.disabled = false;
      button.classList.remove("correct", "incorrect");
    });
    $("#demo-next").disabled = true;
    $("#demo-next").textContent = "Continue →";
  }
  $("#reset-demo").addEventListener("click", resetDemo);
  $("#try-again").addEventListener("click", resetDemo);

  $$(".answer-option").forEach(button => {
    button.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      answerCorrect = button.dataset.answer === "left";
      $$(".answer-option").forEach(option => {
        option.disabled = true;
        if (option.dataset.answer === "left") option.classList.add("correct");
      });
      const feedback = $("#answer-feedback");
      if (answerCorrect) {
        feedback.textContent = "Correct. The left side pumps oxygen-rich blood to the body. Try explaining why the right side sends blood to the lungs.";
        feedback.classList.add("good");
      } else {
        button.classList.add("incorrect");
        feedback.textContent = "Not quite. The left side pumps oxygen-rich blood to the body. Review the route, then try the demo again.";
        feedback.classList.add("bad");
      }
      $("#demo-next").disabled = false;
      $("#demo-progress-fill").style.width = "75%";
    });
  });

  $("#demo-next").addEventListener("click", () => {
    $("#demo-content").classList.add("hidden");
    $("#demo-result").classList.remove("hidden");
    $("#demo-progress-fill").style.width = "100%";
    $("#result-copy").textContent = answerCorrect
      ? "You answered this sample question correctly. A real Ticha account would track learning evidence across lessons and later retests."
      : "You completed the sample check and received feedback. In Ticha, a missed question would guide targeted revision and a later reassessment.";
  });

  function setAuthMode(mode) {
    authMode = mode;
    const signup = mode === "signup";
    $("#auth-title").textContent = signup ? "Create your free account" : "Welcome back";
    $("#auth-description").textContent = signup
      ? "Save your learning progress and continue across sessions."
      : "Log in to continue your learning journey.";
    $("#name-label").classList.toggle("hidden", !signup);
    $("#display-name").required = signup;
    $("#display-name").disabled = !signup;
    $("#password").autocomplete = signup ? "new-password" : "current-password";
    $("#auth-submit").textContent = signup ? "Create account" : "Log in";
    $$(".auth-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.authMode === mode));
    $("#auth-message").textContent = "";
    $("#auth-message").className = "auth-message";
  }
  function openAuth(mode = "signup") {
    setAuthMode(mode);
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => (mode === "login" ? $("#email") : $("#display-name")).focus(), 50);
  }
  function closeAuth() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
  $$("[data-open-auth]").forEach(button => button.addEventListener("click", () => openAuth(button.dataset.openAuth)));
  $$(".auth-tab").forEach(button => button.addEventListener("click", () => setAuthMode(button.dataset.authMode)));
  $("#close-auth").addEventListener("click", closeAuth);
  modal.addEventListener("click", event => { if (event.target === modal) closeAuth(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.classList.contains("hidden")) closeAuth(); });

  authForm.addEventListener("submit", async event => {
    event.preventDefault();
    const message = $("#auth-message");
    const email = $("#email").value.trim();
    const password = $("#password").value;
    const displayName = $("#display-name").value.trim();
    const submit = $("#auth-submit");
    message.className = "auth-message";
    message.textContent = "";
    if (password.length < 8) {
      message.textContent = "Use a password with at least 8 characters.";
      message.classList.add("error");
      return;
    }
    if (!window.tichaSupabaseReady || !window.tichaSupabase) {
      message.textContent = "Demo mode: account creation is not connected yet. Set up Supabase using the README before enabling real accounts.";
      message.classList.add("error");
      return;
    }
    submit.disabled = true;
    submit.textContent = "Please wait…";
    try {
      if (authMode === "signup") {
        const { data, error } = await window.tichaSupabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } }
        });
        if (error) throw error;
        message.textContent = data.session
          ? "Account created. You can now continue building your learning profile."
          : "Check your email for the verification link before logging in.";
        message.classList.add("success");
      } else {
        const { error } = await window.tichaSupabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        message.textContent = "Logged in successfully. The learner dashboard is the next development step.";
        message.classList.add("success");
      }
    } catch (error) {
      message.textContent = error.message || "We could not complete that request. Please try again.";
      message.classList.add("error");
    } finally {
      submit.disabled = false;
      submit.textContent = authMode === "signup" ? "Create account" : "Log in";
    }
  });

  setAuthMode("signup");
})();
      
