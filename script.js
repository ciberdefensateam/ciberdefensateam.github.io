(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var SITE_LINKS = {
    instagram: "https://www.instagram.com/ciberdefensa.undef/",
    drive: "https://drive.google.com/drive/folders/TU_ID_AQUI",
    whatsapp: "https://wa.me/549XXXXXXXXXX",
    discord: "https://discord.gg/TU-INVITE"
  };

  var CONTACT_EMAIL = "contacto@tudominio.com";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isPlaceholder(value) {
    return /TU_ID_AQUI|XXXXXXXXXX|TU-INVITE|tudominio\.com/i.test(value);
  }

  function setLinks() {
    document.querySelectorAll("[data-link]").forEach(function (link) {
      var key = link.dataset.link;
      var url = SITE_LINKS[key];

      if (!url) return;

      link.href = url;

      if (isPlaceholder(url)) {
        link.dataset.unconfigured = "true";
        link.title = "Pendiente de configurar en script.js";
      }
    });
  }

  function setupHeader() {
    var header = document.getElementById("site-header");
    var menuButton = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");

    if (!header) return;

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    function closeMenu() {
      header.dataset.open = "false";
      if (menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú de navegación");
      }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        var isOpen = header.dataset.open === "true";
        header.dataset.open = String(!isOpen);
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación");
      });

      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
      });
    }
  }

  function setupReveals() {
    var elements = document.querySelectorAll("[data-reveal]");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -28px 0px"
    });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function setupActiveNavigation() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
    var sections = navLinks.map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);

    if (!("IntersectionObserver" in window) || !sections.length) return;

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, {
      rootMargin: "-35% 0px -56% 0px",
      threshold: 0
    });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  function setupTerminalIntro() {
    var target = document.querySelector("[data-terminal-type]");
    if (!target || reducedMotion) return;

    var phrase = target.textContent.trim();
    var index = 0;
    target.textContent = "";

    function typeNextCharacter() {
      target.textContent += phrase.charAt(index);
      index += 1;

      if (index < phrase.length) {
        window.setTimeout(typeNextCharacter, 15);
      }
    }

    window.setTimeout(typeNextCharacter, 260);
  }

  function setupTerminal() {
    var form = document.getElementById("terminal-command-form");
    var input = document.getElementById("terminal-command");
    var log = document.getElementById("terminal-log");

    if (!form || !input || !log) return;

    function appendLine(message, className) {
      var line = document.createElement("p");
      line.className = "terminal-response" + (className ? " " + className : "");
      line.textContent = message;
      log.appendChild(line);
    }

    function appendCommand(command) {
      var line = document.createElement("p");
      var user = document.createElement("span");
      var sign = document.createElement("span");

      line.className = "terminal-command";
      user.className = "prompt-user";
      sign.className = "prompt-sign";
      user.textContent = "visitor@ciberdefensa";
      sign.textContent = ":~$";
      line.appendChild(user);
      line.appendChild(sign);
      line.appendChild(document.createTextNode(" " + command));
      log.appendChild(line);
    }

    function openCommunityLink(key, label) {
      var link = SITE_LINKS[key];

      if (isPlaceholder(link)) {
        appendLine("El enlace de " + label + " todavía debe configurarse en script.js.", "terminal-response--error");
        return;
      }

      appendLine("Abriendo " + label + " en una nueva pestaña…", "terminal-response--command");
      window.open(link, "_blank", "noopener,noreferrer");
    }

    function goToSection(id, text) {
      appendLine(text, "terminal-response--command");
      var section = document.getElementById(id);
      if (section) {
        window.setTimeout(function () {
          section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        }, 80);
      }
    }

    function runCommand(rawCommand) {
      var command = rawCommand.trim().toLowerCase();
      if (!command) return;

      appendCommand(rawCommand.trim());

      if (command === "clear" || command === "cls") {
        log.textContent = "";
        appendLine("Terminal limpia. Escribí 'help' para ver los comandos.", "terminal-response--command");
        return;
      }

      if (command === "help" || command === "ayuda") {
        appendLine("help      muestra esta ayuda\nabout     quiénes somos\nlinks     accesos de la comunidad\nrecursos  ir a las áreas de estudio\ndiscord   abrir Discord\ncontacto  ir al formulario\nclear     limpiar la terminal", "terminal-response--command");
        return;
      }

      if (command === "about" || command === "acerca") {
        appendLine("Somos una comunidad nacida entre estudiantes de la Licenciatura en Ciberdefensa de FADENA - UNDEF. Compartimos recursos, práctica y espacios para aprender entre pares.", "terminal-response--command");
        return;
      }

      if (command === "links") {
        appendLine("instagram  novedades y comunidad\ndrive      apuntes y guías compartidas\nwhatsapp   consultas rápidas\ndiscord    recursos por canales", "terminal-response--command");
        return;
      }

      if (command === "recursos" || command === "resources") {
        goToSection("recursos", "Navegando a la base de recursos…");
        return;
      }

      if (command === "contacto" || command === "contact") {
        goToSection("contacto", "Navegando al canal de contacto…");
        return;
      }

      if (command === "instagram" || command === "ig") {
        openCommunityLink("instagram", "Instagram");
        return;
      }

      if (command === "drive") {
        openCommunityLink("drive", "Google Drive");
        return;
      }

      if (command === "whatsapp" || command === "wa") {
        openCommunityLink("whatsapp", "WhatsApp");
        return;
      }

      if (command === "discord") {
        openCommunityLink("discord", "Discord");
        return;
      }

      appendLine("Comando no reconocido: " + command + ". Probá con 'help'.", "terminal-response--error");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input.value;
      input.value = "";
      runCommand(value);
    });

    document.querySelectorAll("[data-command]").forEach(function (button) {
      button.addEventListener("click", function () {
        var command = button.dataset.command;
        runCommand(command);
        input.focus();
      });
    });
  }

  function setupContactForm() {
    var form = document.getElementById("contact-form");
    var feedback = document.getElementById("form-feedback");

    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (isPlaceholder(CONTACT_EMAIL)) {
        if (feedback) {
          feedback.textContent = "Falta configurar el email de contacto en script.js.";
        }
        return;
      }

      var name = document.getElementById("cf-nombre").value.trim();
      var email = document.getElementById("cf-email").value.trim();
      var message = document.getElementById("cf-mensaje").value.trim();
      var subject = encodeURIComponent("Contacto desde Ciberdefensa Team — " + name);
      var body = encodeURIComponent(message + "\n\n—\n" + name + "\n" + email);

      if (feedback) {
        feedback.textContent = "Abriendo tu cliente de correo…";
      }

      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    });
  }

  function setYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  setLinks();
  setupHeader();
  setupReveals();
  setupActiveNavigation();
  setupTerminalIntro();
  setupTerminal();
  setupContactForm();
  setYear();
})();
