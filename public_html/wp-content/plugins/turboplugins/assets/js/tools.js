const navItems = document.querySelectorAll(".turboplugins-nav-link");
const navPanels = document.querySelectorAll(".turboplugins-section");

navItems?.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(el.getAttribute("href"));

    navItems.forEach((el) => el.classList.remove("active"));
    navPanels.forEach((el) => el.classList.remove("active"));

    el.classList.add("active");
    target.classList.add("active");
  });
});

const codeElements = document.querySelectorAll(".turboplugins-code");

codeElements?.forEach((el) => {
  if ("undefined" === typeof CodeMirror) {
    return;
  }

  const codemirror = CodeMirror.fromTextArea(el, {
    value: el.value,
    mode: "htmlmixed",
    autoCloseTags: true,
    lineWrapping: true,
    tabSize: 2,
  });

  codemirror.setSize("100%", 300);
  codemirror.on("changes", () => codemirror.save());
});

const turboForms = document.querySelectorAll(".turboplugins-form");

turboForms?.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    formData.append("action", "turboplugins/tools");
    formData.append("nonce", TurboPlugins.nonce);

    const json = await fetch(TurboPlugins.url, {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    const response = await json.json();

    if ("object" === typeof response.fragments) {
      updateTurboFragments(response.fragments);
    }

    await Swal.fire({
      icon: response.success ? "success" : "error",
      title: response.success ? "Feito!" : "Ops...",
      text: response.data ? response.data : "Algo deu errado",
    });

    if (response.reload) {
      location.reload();
    } else if (response.redirectUrl) {
      location.href = response.redirectUrl;
    }
  });
});

const updateTurboFragments = (fragments) => {
  Object.entries(fragments).forEach(([fragment, content]) => {
    const el = document.querySelector(fragment);
    if (el) {
      el.innerHTML = content;
    }
  });
};

const conditionalContainers = document.querySelectorAll(
  "[data-conditionalInput]"
);

conditionalContainers?.forEach((el) => {
  const parent = el.dataset.conditionalinput;
  const expectedValue = el.dataset.expectedvalue;

  const conditionalInput = document.querySelector(`[name="${parent}"]`);
  conditionalInput.addEventListener("change", () => updateView());

  const containerInput = el.querySelector("input, select, textarea");

  const updateView = () => {
    const valid = conditionalInput.value === expectedValue;

    el.style.display = valid ? "block" : "none";

    if (containerInput) {
      containerInput.required = valid;

      if (!valid) {
        containerInput.value = "";
      }
    }
  };

  updateView();
});

const maintenancePasswordInput = document.querySelector("#maintenancePassword");

maintenancePasswordInput?.addEventListener("keyup", () => {
  const urlSpan = document.querySelector("#maintenancePasswordUrl");
  const value = maintenancePasswordInput.value;

  urlSpan.textContent = urlSpan.dataset.url + "=" + value;
});

const customLoginUrlInput = document.querySelector("#customLoginUrl");
customLoginUrlInput?.addEventListener("keyup", () => {
  const urlSpan = document.querySelector("#customLoginPasswordUrl");
  const value = customLoginUrlInput.value;

  urlSpan.textContent = urlSpan.dataset.url + value;
});

const copyTriggers = document.querySelectorAll("[data-copy]");
copyTriggers?.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();

    const content = el.dataset.copy;
    navigator.clipboard.writeText(content);

    Swal.fire({
      icon: "success",
      text: "Conteúdo copiado com sucesso!",
      timer: 3000,
    });
  });
});
