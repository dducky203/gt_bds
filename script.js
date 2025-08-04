// DOM Elements
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const searchBoxes = document.querySelectorAll(
  ".search-box input, .search-widget input"
);
const searchButtons = document.querySelectorAll(
  ".search-box button, .search-widget button"
);
const pageButtons = document.querySelectorAll(".page-btn");
const articleCards = document.querySelectorAll(".article-card");

// Slideshow Variables
let currentSlideIndex = 0;
let slideInterval;

// Slideshow Functions
function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const indicators = document.querySelectorAll(".indicator");

  if (slides.length === 0) return;

  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"));
  indicators.forEach((indicator) => indicator.classList.remove("active"));

  // Normalize index
  if (index >= slides.length) currentSlideIndex = 0;
  if (index < 0) currentSlideIndex = slides.length - 1;

  // Show current slide
  slides[currentSlideIndex].classList.add("active");
  indicators[currentSlideIndex].classList.add("active");
}

function changeSlide(direction) {
  currentSlideIndex += direction;
  showSlide(currentSlideIndex);
  resetSlideInterval();
}

function currentSlide(index) {
  currentSlideIndex = index - 1;
  showSlide(currentSlideIndex);
  resetSlideInterval();
}

function nextSlide() {
  currentSlideIndex++;
  showSlide(currentSlideIndex);
}

function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
}

// Initialize slideshow
function initSlideshow() {
  showSlide(currentSlideIndex);
  slideInterval = setInterval(nextSlide, 5000);

  // Pause slideshow on hover
  const slideshowContainer = document.querySelector(".slideshow-container");
  if (slideshowContainer) {
    slideshowContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });

    slideshowContainer.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000);
    });
  }
}

// Mobile Menu Toggle
if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    // Animate hamburger menu
    const spans = menuToggle.querySelectorAll("span");
    spans.forEach((span, index) => {
      if (navMenu.classList.contains("active")) {
        if (index === 0)
          span.style.transform = "rotate(45deg) translate(5px, 5px)";
        if (index === 1) span.style.opacity = "0";
        if (index === 2)
          span.style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        span.style.transform = "none";
        span.style.opacity = "1";
      }
    });
  });
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    navMenu &&
    navMenu.classList.contains("active") &&
    !navMenu.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    navMenu.classList.remove("active");

    // Reset hamburger menu
    const spans = menuToggle.querySelectorAll("span");
    spans.forEach((span) => {
      span.style.transform = "none";
      span.style.opacity = "1";
    });
  }
});

// Search Functionality
function handleSearch(input) {
  const searchTerm = input.value.trim().toLowerCase();
  if (searchTerm) {
    // Filter articles based on search term
    articleCards.forEach((card) => {
      const title = card.querySelector("h3 a").textContent.toLowerCase();
      const content = card.querySelector("p").textContent.toLowerCase();

      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        card.style.display = "block";
        card.classList.add("fade-in");
      } else {
        card.style.display = "none";
      }
    });

    // Show search results message
    showSearchResults(searchTerm);
  } else {
    // Show all articles if search is empty
    articleCards.forEach((card) => {
      card.style.display = "block";
    });
    hideSearchResults();
  }
}

function showSearchResults(term) {
  let resultsMessage = document.querySelector(".search-results-message");
  if (!resultsMessage) {
    resultsMessage = document.createElement("div");
    resultsMessage.className = "search-results-message";
    resultsMessage.style.cssText = `
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #3498db;
            color: #1976d2;
        `;
    document
      .querySelector(".articles-section")
      .insertBefore(resultsMessage, document.querySelector(".articles-grid"));
  }

  const visibleCards = document.querySelectorAll(
    '.article-card[style*="block"], .article-card:not([style*="none"])'
  );
  resultsMessage.innerHTML = `
        <i class="fas fa-search"></i> 
        Tìm thấy ${visibleCards.length} kết quả cho "<strong>${term}</strong>"
        <button onclick="clearSearch()" style="float: right; background: none; border: none; color: #1976d2; cursor: pointer;">
            <i class="fas fa-times"></i> Xóa tìm kiếm
        </button>
    `;
}

function hideSearchResults() {
  const resultsMessage = document.querySelector(".search-results-message");
  if (resultsMessage) {
    resultsMessage.remove();
  }
}

function clearSearch() {
  searchBoxes.forEach((input) => (input.value = ""));
  articleCards.forEach((card) => (card.style.display = "block"));
  hideSearchResults();
}

// Add search event listeners
searchButtons.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch(searchBoxes[index]);
  });
});

searchBoxes.forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(input);
    }
  });

  // Real-time search
  input.addEventListener("input", () => {
    if (input.value.length >= 2 || input.value.length === 0) {
      handleSearch(input);
    }
  });
});

// Pagination
pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    pageButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to clicked button
    if (!isNaN(button.textContent)) {
      button.classList.add("active");
    }

    // Simulate page loading
    const articlesGrid = document.querySelector(".articles-grid");
    articlesGrid.style.opacity = "0.5";

    setTimeout(() => {
      articlesGrid.style.opacity = "1";
      // Scroll to top of articles
      document.querySelector(".articles-section").scrollIntoView({
        behavior: "smooth",
      });
    }, 500);
  });
});

// Smooth Scrolling for Navigation Links
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

// Scroll to Top Button
function createScrollToTopButton() {
  const scrollBtn = document.createElement("button");
  scrollBtn.className = "scroll-to-top";
  scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollBtn.setAttribute("title", "Lên đầu trang");
  document.body.appendChild(scrollBtn);

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });
}

// Lazy Loading for Images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Contact Form Handling (if you add a contact form later)
function handleContactForm() {
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.email || !data.message) {
        showNotification("Vui lòng điền đầy đủ thông tin!", "error");
        return;
      }

      // Show loading
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="loading"></span> Đang gửi...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        showNotification(
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.",
          "success"
        );
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

  // Set background color based on type
  const colors = {
    success: "#27ae60",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
  };
  notification.style.backgroundColor = colors[type] || colors.info;

  notification.innerHTML = `
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-circle"
            : type === "warning"
            ? "exclamation-triangle"
            : "info-circle"
        }"></i>
        <span style="margin-left: 10px;">${message}</span>
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer; margin-left: 15px;">
            <i class="fas fa-times"></i>
        </button>
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Article Card Interactions
function enhanceArticleCards() {
  articleCards.forEach((card) => {
    // Add hover effect data
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });

    // Add click to read functionality
    const readMoreBtn = card.querySelector(".read-more");
    if (readMoreBtn) {
      readMoreBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Simulate article loading
        const title = card.querySelector("h3 a").textContent;
        showNotification(`Đang tải bài viết: "${title}"...`, "info");

        // You can add actual article loading logic here
        setTimeout(() => {
          showNotification(
            "Bài viết sẽ được tải trong phiên bản đầy đủ!",
            "warning"
          );
        }, 1500);
      });
    }
  });
}

// Social Share Functionality
// function addSocialShare() {
//     const socialLinks = document.querySelectorAll('.social-link');
//     socialLinks.forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();

//             const platform = link.classList.contains('facebook') ? 'Facebook' :
//                            link.classList.contains('youtube') ? 'YouTube' :
//                            link.classList.contains('tiktok') ? 'TikTok' :
//                            'Email';

//             if (platform === 'Email') {
//                 window.location.href = 'mailto:info.muabanbatdongsan@gmail.com?subject=Liên hệ từ website&body=Xin chào, tôi muốn tìm hiểu thêm về dịch vụ của các bạn.';
//             } else {
//                 showNotification(`Đang chuyển đến ${platform}...`, 'info');
//                 // Add actual social media links here
//             }
//         });
//     });
// }

// // Initialize everything when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     initSlideshow();
//     createScrollToTopButton();
//     lazyLoadImages();
//     handleContactForm();
//     enhanceArticleCards();
//     addSocialShare();

//     // Add fade-in animation to main sections
//     const sections = document.querySelectorAll('.hero, .slideshow-section, .main-content, .footer');
//     sections.forEach((section, index) => {
//         setTimeout(() => {
//             section.classList.add('fade-in');
//         }, index * 200);
//     });

//     // Show welcome message
//     setTimeout(() => {
//         showNotification('Chào mừng bạn đến với Mua Bán Bất Động Sản!', 'success');
//     }, 1000);
// });

// Advanced Features

// Weather Widget (optional)
function addWeatherWidget() {
  // This would integrate with a weather API for Hanoi
  const weatherWidget = document.createElement("div");
  weatherWidget.className = "weather-widget";
  weatherWidget.innerHTML = `
        <div class="widget">
            <h3><i class="fas fa-cloud-sun"></i> Thời tiết Hà Nội</h3>
            <div class="weather-info">
                <div class="temp">28°C</div>
                <div class="condition">Nắng ít mây</div>
                <div class="details">
                    <span><i class="fas fa-eye"></i> Tầm nhìn: 10km</span>
                    <span><i class="fas fa-tint"></i> Độ ẩm: 65%</span>
                </div>
            </div>
        </div>
    `;

  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.appendChild(weatherWidget);
  }
}

// Property Calculator
// function addPropertyCalculator() {
//   const calculator = document.createElement("div");
//   calculator.className = "widget";
//   calculator.innerHTML = `
//         <h3><i class="fas fa-calculator"></i> Tính toán vay mua nhà</h3>
//         <div class="calculator">
//             <input type="number" id="loan-amount" placeholder="Số tiền vay (triệu VND)">
//             <input type="number" id="interest-rate" placeholder="Lãi suất (%/năm)">
//             <input type="number" id="loan-term" placeholder="Thời hạn (năm)">
//             <button onclick="calculateLoan()">Tính toán</button>
//             <div id="loan-result"></div>
//         </div>
//     `;

//   const sidebar = document.querySelector(".sidebar");
//   if (sidebar) {
//     sidebar.appendChild(calculator);
//   }
// }

// Loan calculation function
function calculateLoan() {
  console.log("calculateLoan function called"); // Debug log

  const amountInput = document.getElementById("loanAmount");
  const rateInput = document.getElementById("interestRate");
  const termInput = document.getElementById("loanTerm");

  console.log("Input elements:", amountInput, rateInput, termInput); // Debug log

  if (!amountInput || !rateInput || !termInput) {
    showNotification("Không tìm thấy các trường nhập liệu!", "error");
    return;
  }

  const amount = parseFloat(amountInput.value) * 1000000; // Convert to VND
  const rate = parseFloat(rateInput.value) / 100 / 12; // Monthly rate
  const term = parseFloat(termInput.value) * 12; // Months

  console.log("Values:", amount, rate, term); // Debug log

  if (amount > 0 && rate > 0 && term > 0) {
    const monthlyPayment =
      (amount * rate * Math.pow(1 + rate, term)) /
      (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;

    console.log("Calculated:", monthlyPayment, totalPayment, totalInterest); // Debug log

    // Update the result display elements
    const monthlyElement = document.getElementById("monthlyPayment");
    const totalElement = document.getElementById("totalPayment");
    const interestElement = document.getElementById("totalInterest");
    const resultContainer = document.getElementById("calculatorResult");

    console.log(
      "Result elements:",
      monthlyElement,
      totalElement,
      interestElement
    ); // Debug log

    if (monthlyElement) {
      monthlyElement.textContent = `${Math.round(monthlyPayment).toLocaleString(
        "vi-VN"
      )} VND`;
    }

    if (totalElement) {
      totalElement.textContent = `${Math.round(totalPayment).toLocaleString(
        "vi-VN"
      )} VND`;
    }

    if (interestElement) {
      interestElement.textContent = `${Math.round(totalInterest).toLocaleString(
        "vi-VN"
      )} VND`;
    }

    // Make the result container visible and highlighted
    if (resultContainer) {
      resultContainer.classList.add("show");
      resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Show success notification
    showNotification("Tính toán thành công!", "success");
  } else {
    showNotification(
      "Vui lòng nhập đầy đủ thông tin hợp lệ (số > 0)!",
      "error"
    );
  }
}

// Call performance optimization
optimizePerformance();

// Performance optimization
function optimizePerformance() {
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Handle scroll events here
    }, 10);
  });

  // Preload critical images
  const criticalImages = document.querySelectorAll(
    ".hero img, .article-image img"
  );
  criticalImages.forEach((img) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = img.src;
    document.head.appendChild(link);
  });
}

// Call performance optimization
optimizePerformance();

// Smooth Scrolling for Navigation Links
document.addEventListener("DOMContentLoaded", function () {
  // Initialize slideshow
  initSlideshow();

  // Add smooth scrolling behavior to all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to target element
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, "#" + targetId);
        }
      }
    });
  });

  // Handle hash links on page load
  if (window.location.hash) {
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  }
});
