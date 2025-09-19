const TurboPluginsUiManager = {
  turboWorking: false,
  searchInput: null,
  sortInput: null,
  categoryInput: null,
  installationForms: null,
  navItems: null,
  panels: null,
  allPanelCards: [],
  filteredPanelCards: [],
  VISIBLE_BATCH_SIZE: 8,
  descriptionsTrigger: null,

  init() {
    this.cacheElements();
    this.bindEvents();
    this.setupLazyLoad();

    this.showPanel(this.navItems[0]);
  },

  cacheElements() {
    this.searchForms = document.querySelectorAll(
      ".turboplugins-item-search-container"
    );
    this.installationForms = document.querySelectorAll(
      ".turboplugins-item-card__install"
    );
    this.navItems = document.querySelectorAll("#turbbocloud-nav a");
    this.panels = document.querySelectorAll("#turboplugins-panels .panel");

    this.descriptionsTrigger = document.querySelectorAll(".toggle-description");
  },

  bindEvents() {
    this.navItems?.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.showPanel(item);
      });
    });

    this.searchForms?.forEach((form) => {
      const inputs = {
        search: form.querySelector('[name="search"]'),
        categories: form.querySelectorAll('[name="category"]'),
        sort: form.querySelector('[name="sort"]'),
        update: form.querySelector('[name="update"]'),
      };

      inputs.search?.addEventListener("keyup", () =>
        this.filterPlugins(inputs)
      );
      inputs.categories?.forEach((input) =>
        input.addEventListener("change", () => this.filterPlugins(inputs))
      );

      inputs.update?.addEventListener("click", () =>
        this.filterPlugins(inputs)
      );

      inputs.sort?.addEventListener("change", () => this.sortPlugins(inputs));
    });

    this.installationForms?.forEach((form) => {
      form.addEventListener("submit", (event) =>
        this.handleFormSubmit(event, form)
      );
    });

    this.descriptionsTrigger?.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();

        const key = trigger.dataset.description;
        const data = window.turboDescriptions[key] ?? null;

        if (!data) return;

        Swal.fire({
          icon: "info",
          title: data.title,
          html: data.description,
          showCloseButton: true,
          showConfirmButton: true,
          confirmButtonText: "Obrigado",
        });
      });
    });
  },

  showPanel(navItem) {
    const selector = navItem.getAttribute("href");

    this.panels?.forEach((panel) => panel.classList.remove("active"));
    this.navItems?.forEach((item) => item.classList.remove("active"));

    navItem.classList.add("active");
    const activePanel = document.querySelector(selector);
    activePanel?.classList.add("active");

    this.allPanelCards = Array.from(
      activePanel.querySelectorAll(".turboplugins-item-card")
    );
    this.filteredPanelCards = [...this.allPanelCards];

    this.sortPlugins(this.filteredPanelCards);
    this.resetVisible(this.filteredPanelCards);
  },

  normalizeString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  },

  async handleFormSubmit(event, form) {
    event.preventDefault();

    if (this.turboWorking) {
      return Swal.fire({
        title: "Só um pouquinho",
        text: "Outro processo está ativo no momento, aguarde.",
        icon: "warning",
      });
    }

    this.turboWorking = true;
    const btn = form.querySelector("button[type='submit']");
    const previousText = btn.textContent;

    btn.disabled = true;
    btn.textContent = "Processando...";

    try {
      const response = await fetch(ajaxurl, {
        method: "POST",
        body: new FormData(form),
      }).then((res) => res.json());

      Swal.fire({
        title: response.success ? "Pronto!" : "Ops!",
        html: response.data,
        icon: response.success ? "success" : "error",
      }).then(() => {
        if (response.redirect) location.href = response.redirect;
      });
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Não foi possível processar a solicitação.",
        icon: "error",
      });
    } finally {
      btn.disabled = false;
      btn.textContent = previousText;
      this.turboWorking = false;
    }
  },

  filterPlugins(inputs) {
    const query = this.normalizeString(inputs.search?.value.trim() || "");
    const selectedCategories = Array.from(inputs.categories)
      .filter((input) => input.checked)
      .map((input) => parseInt(input.value, 10));
    const onlyUpdate = inputs.update?.checked;

    this.filteredPanelCards = this.allPanelCards.filter((plugin) => {
      const name = this.normalizeString(plugin.dataset.name);
      const pluginCategory = parseInt(plugin.dataset.category, 10);
      const hasUpdate = plugin.dataset.action === "update";

      const matchesUpdate = !onlyUpdate || hasUpdate;
      const matchesSearch = !query || name.includes(query);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(pluginCategory);

      return matchesSearch && matchesCategory && matchesUpdate;
    });

    this.sortPlugins(inputs);
  },

  sortPlugins(inputs) {
    const criteria = inputs.sort?.value || "nameAsc";

    this.filteredPanelCards.sort((a, b) => {
      const getData = (el, key) => {
        const val = el.dataset[key];
        return key.includes("at")
          ? parseInt(val, 10)
          : this.normalizeString(val);
      };

      if (criteria === "nameAsc")
        return getData(a, "name").localeCompare(getData(b, "name"));
      if (criteria === "nameDesc")
        return getData(b, "name").localeCompare(getData(a, "name"));
      if (criteria === "updatedAt")
        return getData(b, "updatedat") - getData(a, "updatedat");
      if (criteria === "modifiedAt")
        return getData(b, "modifiedat") - getData(a, "modifiedat");

      return 0;
    });

    this.filteredPanelCards.forEach((card, index) => {
      card.style.order = index;
    });

    this.resetVisible(this.filteredPanelCards);
  },

  resetVisible(cards) {
    this.allPanelCards.forEach((card) => card.classList.remove("visible"));
    cards.forEach((card, index) => {
      if (index < this.VISIBLE_BATCH_SIZE) {
        card.classList.add("visible");
      }
    });
  },

  setupLazyLoad() {
    window.addEventListener("scroll", () => {
      const panel = document.querySelector(".panel.active");
      if (!panel) return;

      const grid = panel.querySelector(".turboplugins-items-grid");
      if (!grid) return;

      const visible = Array.from(
        grid.querySelectorAll(".turboplugins-item-card.visible")
      ).sort((a, b) => parseInt(a.style.order) - parseInt(b.style.order));

      const lastVisible = visible[visible.length - 1];

      if (!lastVisible) return;

      const lastBottom = lastVisible.offsetTop + lastVisible.offsetHeight;
      const scrollBottom = window.scrollY + window.innerHeight;

      if (scrollBottom > lastBottom) {
        const lastIndex = this.filteredPanelCards.indexOf(lastVisible);
        const nextBatch = this.filteredPanelCards.slice(
          lastIndex + 1,
          lastIndex + 1 + this.VISIBLE_BATCH_SIZE
        );
        nextBatch.forEach((card) => card.classList.add("visible"));
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  TurboPluginsUiManager.init();
});
