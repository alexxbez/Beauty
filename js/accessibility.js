/* ==========================================================================
   Maison Éclat — accessibility toolkit
   Vanilla JavaScript only. No dependencies, no tracking.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "eclat-a11y";
  var root = document.documentElement;

  var panel = document.getElementById("a11y-panel");
  var toggle = document.getElementById("a11y-toggle");
  var closeBtn = document.getElementById("a11y-close");
  var sizeValue = document.getElementById("a11y-size-value");
  var sizeDown = document.querySelector('[data-size-step="-1"]');
  var sizeUp = document.querySelector('[data-size-step="1"]');
  var easyFont = document.getElementById("a11y-easy-font");
  var contrast = document.getElementById("a11y-contrast");
  var motion = document.getElementById("a11y-motion");
  var readBtn = document.getElementById("a11y-read");
  var stopBtn = document.getElementById("a11y-stop");
  var audioNote = document.getElementById("a11y-audio-note");
  var resetBtn = document.getElementById("a11y-reset");
  var status = document.getElementById("a11y-status");

  var dictateBtn = document.getElementById("a11y-dictate");
  var messageField = document.getElementById("message");
  var dictationNote = document.getElementById("dictation-note");
  var form = document.getElementById("enquiry-form");
  var formStatus = document.getElementById("form-status");

  if (!panel || !toggle) {
    return;
  }

  var sizes = ["100%", "110%", "120%", "130%", "140%"];
  var state = {
    textSize: 1,
    easyFont: false,
    highContrast: false,
    reduceMotion: false
  };

  /* ------------------------------------------------------------------------
     Storage
     ------------------------------------------------------------------------ */
  function readStorage() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function writeStorage() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      /* Private browsing or blocked storage: settings simply last for this page. */
    }
  }

  function announce(text) {
    if (!status) {
      return;
    }
    status.textContent = "";
    window.setTimeout(function () {
      status.textContent = text;
    }, 30);
  }

  /* ------------------------------------------------------------------------
     Apply and persist state
     ------------------------------------------------------------------------ */
  function applyState() {
    state.textSize = Math.min(5, Math.max(1, Number(state.textSize) || 1));

    root.setAttribute("data-text-size", String(state.textSize));
    if (sizeValue) {
      sizeValue.textContent = sizes[state.textSize - 1];
    }
    if (sizeDown) {
      sizeDown.disabled = state.textSize <= 1;
    }
    if (sizeUp) {
      sizeUp.disabled = state.textSize >= 5;
    }

    root.classList.toggle("easy-read", Boolean(state.easyFont));
    if (easyFont) {
      easyFont.checked = Boolean(state.easyFont);
    }

    root.classList.toggle("high-contrast", Boolean(state.highContrast));
    if (contrast) {
      contrast.checked = Boolean(state.highContrast);
    }

    root.classList.toggle("reduce-motion", Boolean(state.reduceMotion));
    if (motion) {
      motion.checked = Boolean(state.reduceMotion);
    }
  }

  function saveAndApply() {
    applyState();
    writeStorage();
  }

  /* ------------------------------------------------------------------------
     Initial state: saved choices, otherwise system preferences
     ------------------------------------------------------------------------ */
  var saved = readStorage();

  if (saved && typeof saved === "object") {
    if (saved.textSize != null) {
      state.textSize = saved.textSize;
    }
    if (typeof saved.easyFont === "boolean") {
      state.easyFont = saved.easyFont;
    }
    if (typeof saved.highContrast === "boolean") {
      state.highContrast = saved.highContrast;
    }
    if (typeof saved.reduceMotion === "boolean") {
      state.reduceMotion = saved.reduceMotion;
    }
  } else {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.reduceMotion = true;
    }
    if (window.matchMedia && window.matchMedia("(prefers-contrast: more)").matches) {
      state.highContrast = true;
    }
  }

  applyState();

  /* ------------------------------------------------------------------------
     Text size
     ------------------------------------------------------------------------ */
  function setTextSize(nextSize) {
    state.textSize = Math.min(5, Math.max(1, nextSize));
    saveAndApply();
    announce("Text size " + sizes[state.textSize - 1] + ".");
  }

  if (sizeDown) {
    sizeDown.addEventListener("click", function () {
      setTextSize(state.textSize - 1);
    });
  }

  if (sizeUp) {
    sizeUp.addEventListener("click", function () {
      setTextSize(state.textSize + 1);
    });
  }

  /* ------------------------------------------------------------------------
     Font, contrast, motion
     ------------------------------------------------------------------------ */
  if (easyFont) {
    easyFont.addEventListener("change", function () {
      state.easyFont = easyFont.checked;
      saveAndApply();
      announce(state.easyFont ? "Easy-read font on." : "Easy-read font off.");
    });
  }

  if (contrast) {
    contrast.addEventListener("change", function () {
      state.highContrast = contrast.checked;
      saveAndApply();
      announce(state.highContrast ? "High contrast on." : "High contrast off.");
    });
  }

  if (motion) {
    motion.addEventListener("change", function () {
      state.reduceMotion = motion.checked;
      saveAndApply();
      announce(state.reduceMotion ? "Reduced motion on." : "Reduced motion off.");
    });
  }

  /* ------------------------------------------------------------------------
     Toolbar panel
     ------------------------------------------------------------------------ */
  var panelOpen = false;

  function onDocumentKeydown(event) {
    if (event.key === "Escape") {
      closePanel(true);
    }
  }

  function onDocumentClick(event) {
    if (!panelOpen) {
      return;
    }
    if (!panel.contains(event.target) && !toggle.contains(event.target)) {
      closePanel(false);
    }
  }

  function openPanel() {
    panel.hidden = false;
    panelOpen = true;
    toggle.setAttribute("aria-expanded", "true");
    document.addEventListener("keydown", onDocumentKeydown);
    document.addEventListener("click", onDocumentClick);

    var firstControl = panel.querySelector("button, input, select, textarea, a[href]");
    if (firstControl) {
      firstControl.focus();
    }
  }

  function closePanel(returnFocus) {
    panel.hidden = true;
    panelOpen = false;
    toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onDocumentKeydown);
    document.removeEventListener("click", onDocumentClick);

    if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    if (panelOpen) {
      closePanel(true);
    } else {
      openPanel();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closePanel(true);
    });
  }

  /* ------------------------------------------------------------------------
     Reset
     ------------------------------------------------------------------------ */
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      state.textSize = 1;
      state.easyFont = false;
      state.highContrast = false;
      state.reduceMotion = false;
      saveAndApply();
      stopReading(false);
      announce("All accessibility settings reset.");
    });
  }

  /* ------------------------------------------------------------------------
     Read aloud
     ------------------------------------------------------------------------ */
  var synth = window.speechSynthesis;
  var supportsSpeech =
    Boolean(synth) && typeof window.SpeechSynthesisUtterance === "function";
  var reading = false;

  function clearReadingHighlight() {
    var highlighted = document.querySelectorAll(".is-reading");
    for (var i = 0; i < highlighted.length; i += 1) {
      highlighted[i].classList.remove("is-reading");
    }
  }

  function stopReading(shouldAnnounce) {
    if (synth) {
      synth.cancel();
    }
    reading = false;
    clearReadingHighlight();
    if (stopBtn) {
      stopBtn.disabled = true;
    }
    if (readBtn && supportsSpeech) {
      readBtn.disabled = false;
    }
    if (audioNote && supportsSpeech) {
      audioNote.textContent = "Read aloud uses your browser's speech voice.";
    }
    if (shouldAnnounce) {
      announce("Reading stopped.");
    }
  }

  function getReadableElements() {
    var main = document.getElementById("main");
    if (!main) {
      return [];
    }

    var selector = "h1, h2, h3, h4, p, li, blockquote, figcaption, td, th";
    var nodes = Array.prototype.slice.call(main.querySelectorAll(selector));

    return nodes.filter(function (element) {
      if (element.closest(".no-read, .a11y, [hidden]")) {
        return false;
      }
      if (element.getAttribute("aria-hidden") === "true") {
        return false;
      }
      if (element.querySelector(selector)) {
        return false;
      }
      var text = (element.textContent || "").replace(/\s+/g, " ").trim();
      return text.length > 1;
    });
  }

  function readPage() {
    if (!supportsSpeech) {
      return;
    }

    stopReading(false);

    var selection = "";
    if (window.getSelection) {
      selection = String(window.getSelection()).replace(/\s+/g, " ").trim();
    }

    var items = [];
    if (selection.length > 1) {
      items = [{ text: selection, element: null }];
    } else {
      items = getReadableElements().map(function (element) {
        return {
          text: (element.textContent || "").replace(/\s+/g, " ").trim(),
          element: element
        };
      });
    }

    if (!items.length) {
      announce("There is no text to read.");
      return;
    }

    reading = true;
    if (stopBtn) {
      stopBtn.disabled = false;
    }
    if (audioNote) {
      audioNote.textContent = "Reading aloud. Use Stop to end.";
    }
    announce("Reading page aloud.");

    var remaining = items.length;

    items.forEach(function (item) {
      var utterance = new window.SpeechSynthesisUtterance(item.text);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1;

      utterance.onstart = function () {
        if (!reading) {
          return;
        }
        clearReadingHighlight();
        if (item.element) {
          item.element.classList.add("is-reading");
        }
      };

      utterance.onend = function () {
        if (!reading) {
          return;
        }
        remaining -= 1;
        if (remaining <= 0) {
          reading = false;
          clearReadingHighlight();
          if (stopBtn) {
            stopBtn.disabled = true;
          }
          if (audioNote) {
            audioNote.textContent = "Finished reading.";
          }
          announce("Finished reading.");
        }
      };

      utterance.onerror = function (event) {
        if (event.error === "interrupted" || event.error === "canceled") {
          return;
        }
        reading = false;
        clearReadingHighlight();
        if (stopBtn) {
          stopBtn.disabled = true;
        }
        if (audioNote) {
          audioNote.textContent = "Read aloud could not start in this browser.";
        }
        announce("Read aloud could not start in this browser.");
      };

      synth.speak(utterance);
    });
  }

  if (!supportsSpeech) {
    if (readBtn) {
      readBtn.disabled = true;
      readBtn.textContent = "Read aloud unavailable";
    }
    if (stopBtn) {
      stopBtn.disabled = true;
    }
    if (audioNote) {
      audioNote.textContent = "Read aloud is not supported in this browser.";
    }
  } else {
    if (readBtn) {
      readBtn.addEventListener("click", readPage);
    }
    if (stopBtn) {
      stopBtn.addEventListener("click", function () {
        stopReading(true);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Voice dictation (contact page)
     ------------------------------------------------------------------------ */
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (dictateBtn && messageField) {
    if (!SpeechRecognition) {
      dictateBtn.hidden = true;
      if (dictationNote) {
        dictationNote.hidden = false;
        dictationNote.textContent =
          "Voice dictation is not supported in this browser. Please type your message.";
      }
    } else {
      dictateBtn.hidden = false;
      if (dictationNote) {
        dictationNote.hidden = false;
      }

      var recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      var listening = false;
      var dictateLabel = dictateBtn.querySelector(".dictate-label");

      function setListening(isListening) {
        listening = isListening;
        dictateBtn.setAttribute("aria-pressed", isListening ? "true" : "false");
        if (dictateLabel) {
          dictateLabel.textContent = isListening ? "Stop dictation" : "Dictate message";
        }
        if (isListening) {
          if (audioNote) {
            audioNote.textContent =
              "Listening. Speak clearly; your words are added to the message field.";
          }
          announce("Dictation started.");
        } else {
          if (audioNote) {
            audioNote.textContent = "Dictation stopped.";
          }
          announce("Dictation stopped.");
        }
      }

      dictateBtn.addEventListener("click", function () {
        if (listening) {
          try {
            recognition.stop();
          } catch (error) {
            /* Already stopped. */
          }
          setListening(false);
          return;
        }

        try {
          recognition.start();
          setListening(true);
        } catch (error) {
          if (audioNote) {
            audioNote.textContent = "Dictation could not start. Please type your message.";
          }
          announce("Dictation could not start.");
        }
      });

      recognition.onresult = function (event) {
        var finalText = "";
        var interimText = "";

        for (var i = event.resultIndex; i < event.results.length; i += 1) {
          var transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript + " ";
          } else {
            interimText += transcript;
          }
        }

        if (finalText) {
          var needsSpace = messageField.value && !/\s$/.test(messageField.value);
          messageField.value += (needsSpace ? " " : "") + finalText.trim() + " ";
          messageField.dispatchEvent(new Event("input", { bubbles: true }));
        }

        if (audioNote) {
          audioNote.textContent = interimText
            ? "Listening: " + interimText
            : "Listening…";
        }
      };

      recognition.onerror = function (event) {
        setListening(false);

        var message = "Dictation stopped.";
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          message = "Microphone permission was denied. You can type your message instead.";
        } else if (event.error === "no-speech") {
          message = "No speech was detected. Try again or type your message.";
        } else if (event.error === "network") {
          message = "Dictation needs a network connection in this browser. You can type your message.";
        }

        if (audioNote) {
          audioNote.textContent = message;
        }
        announce(message);
      };

      recognition.onend = function () {
        if (listening) {
          setListening(false);
        }
      };
    }
  }

  /* ------------------------------------------------------------------------
     Demonstration contact form
     ------------------------------------------------------------------------ */
  if (form && formStatus) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nameField = form.querySelector("#name");
      var name = nameField ? nameField.value.trim() : "";
      var greeting = name ? "Thank you, " + name + "." : "Thank you.";

      formStatus.textContent =
        greeting +
        " This is a demonstration form, so no message has been sent. " +
        "Please email bonjour@maisoneclat.example to reach the atelier directly.";
    });
  }
})();
