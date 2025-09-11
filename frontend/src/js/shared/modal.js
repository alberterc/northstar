const modal = document.getElementById("modal");

if (modal) {
  const overlayEl = modal.querySelector(".modal-overlay");
  if (overlayEl) {
    overlayEl.addEventListener("click", closeModal);
  }
}

export function openModal(htmlSource, { showSubmit = true, onSubmit = null }) {
  if (modal) {
    // body logic
    const modalBodyEl = modal.querySelector("#modal-body");
    if (modalBodyEl) {
      try {
        modalBodyEl.innerHTML = htmlSource;
      } catch (err) {
        modalBodyEl.innerHTML = `<p>${err.message}</p>`;
      }
    }

    // footer logic
    const footerEl = modal.querySelector("#modal-footer");
    if (footerEl) {
      const closeBtnEl = footerEl.querySelector(".close-btn");
      const submitBtnEl = footerEl.querySelector(".submit-btn");

      footerEl.innerHTML = "";

      if (closeBtnEl) {
        footerEl.appendChild(closeBtnEl);
        closeBtnEl.addEventListener("click", closeModal);
      }
      if (submitBtnEl && showSubmit) {
        footerEl.appendChild(submitBtnEl);
        submitBtnEl.addEventListener("click", () => {
          const formEl = modalBodyEl.querySelector("#main-quest-form");
          if (formEl) {
            if (!formEl.checkValidity()) {
              formEl.reportValidity();
              return;
            } else {
              const formData = new FormData(formEl);
              const res = Object.fromEntries(formData.entries());
              if (res.started_at) {
                res.started_at = res.started_at.replace("T", " ");
              }
              if (onSubmit) onSubmit(res);
            }
          } else {
            if (onSubmit) onSubmit(null);
          }
          closeModal();
        });
      }
    }

    modal.classList.replace("hidden", "flex");
  }
}

export function closeModal() {
  if (modal) {
    modal.classList.replace("flex", "hidden");
    const modalBodyEl = modal.querySelector("#modal-body");
    if (modalBodyEl) {
      modalBodyEl.innerHTML = "";
    }
  }
}
