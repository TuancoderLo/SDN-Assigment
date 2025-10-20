// Main JavaScript file for Perfume Store

document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add fade-in animation to cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".card").forEach((card) => {
    observer.observe(card);
  });

  // Load featured perfumes on home page
  if (window.location.pathname === "/") {
    loadFeaturedPerfumes();
  }
});

// Global utility functions
window.utils = {
  // Format currency
  formatCurrency: function (amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  // Format date
  formatDate: function (dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Show toast notification
  showToast: function (message, type = "success") {
    const toastContainer =
      document.getElementById("toast-container") || createToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${
                      type === "success" ? "check-circle" : "exclamation-circle"
                    } me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

    toastContainer.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener("hidden.bs.toast", () => {
      toast.remove();
    });
  },

  // Show loading spinner
  showLoading: function (container) {
    container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading...</p>
            </div>
        `;
  },

  // Show error message
  showError: function (
    container,
    message = "An error occurred. Please try again."
  ) {
    container.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${message}
            </div>
        `;
  },

  // Debounce function
  debounce: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// API helper functions
window.api = {
  baseUrl: "/api",

  // Generic GET request
  get: async function (endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Generic POST request
  post: async function (endpoint, body) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

// Featured perfumes loader for home page
async function loadFeaturedPerfumes() {
  const container = document.getElementById("featured-perfumes");
  if (!container) return;

  utils.showLoading(container);

  try {
    const data = await api.get("/perfumes?limit=8");

    if (data.success && data.data.perfumes && data.data.perfumes.length > 0) {
      container.innerHTML = data.data.perfumes
        .map(
          (perfume) => `
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="card h-100 shadow-sm perfume-card">
                        <div class="card-img-top perfume-image d-flex align-items-center justify-content-center" style="height: 200px;">
                            <i class="fas fa-spray-can fa-3x text-muted"></i>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${perfume.name}</h5>
                            <p class="card-text text-muted small">${
                              perfume.brand?.name || "Unknown Brand"
                            }</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="price-tag text-primary">${utils.formatCurrency(
                                      perfume.price
                                    )}</span>
                                    <span class="badge bg-secondary">${
                                      perfume.size
                                    }ml</span>
                                </div>
                                <a href="/perfumes/${
                                  perfume._id
                                }" class="btn btn-primary w-100">
                                    <i class="fas fa-eye me-1"></i>View Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
        .join("");
    } else {
      container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        No perfumes available at the moment.
                    </div>
                    <a href="/perfumes" class="btn btn-primary">
                        <i class="fas fa-search me-1"></i>Browse All Perfumes
                    </a>
                </div>
            `;
    }
  } catch (error) {
    console.error("Error loading featured perfumes:", error);

    // Show more specific error message
    let errorMessage = "Failed to load featured perfumes.";
    if (error.message.includes("timeout")) {
      errorMessage = "Database connection timeout. Please try again.";
    } else if (error.message.includes("503")) {
      errorMessage =
        "Database is temporarily unavailable. Please try again later.";
    }

    container.innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle me-2"></i>
          ${errorMessage}
          <br>
          <button class="btn btn-outline-primary mt-2" onclick="loadFeaturedPerfumes()">
            <i class="fas fa-refresh me-1"></i>Try Again
          </button>
        </div>
      </div>
    `;
  }
}

// Create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toast-container";
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "9999";
  document.body.appendChild(container);
  return container;
}
