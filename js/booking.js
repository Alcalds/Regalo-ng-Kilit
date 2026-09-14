(() => {
  'use strict';

  const form = document.getElementById('booking-form');
  if (!form) return;

  const errorBox = document.getElementById('booking-error');
  const steps = [...document.querySelectorAll('.booking-step')];
  const progressItems = [...document.querySelectorAll('[data-progress-step]')];
  const nextButtons = [...document.querySelectorAll('[data-next]')];
  const prevButtons = [...document.querySelectorAll('[data-prev]')];

  const guestInput = document.getElementById('guest-count');
  const guestPlural = document.getElementById('guest-plural');
  const dateInput = document.getElementById('visit-date');
  const expectationTitle = document.getElementById('expectation-title');
  const expectationIntro = document.getElementById('expectation-intro');
  const expectationPrice = document.getElementById('expectation-price');
  const expectationPoints = document.getElementById('expectation-points');

  const experienceData = {
    mangrove: {
      name: 'Mangrove Kayak',
      rate: 600,
      intro: 'Explore Kingfisher Park’s mangrove waterways by kayak when tide level and water depth are suitable.',
      points: [
        'Availability depends on low/high tide conditions and resulting water depth.',
        'This is an outdoor water-based nature experience.',
        'Follow guide and safety instructions throughout the activity.'
      ]
    },
    firefly: {
      name: 'Firefly Boardwalk',
      rate: 400,
      intro: 'Experience the mangrove landscape after dark from the Firefly Boardwalk.',
      points: [
        'Keep voices and unnecessary noise low during wildlife viewing.',
        'Avoid flash photography around fireflies.',
        'Follow park and guide instructions on dark paths and viewing areas.'
      ]
    },
    'night-kayak': {
      name: 'Fireflies + Night Kayak',
      rate: 600,
      intro: 'Combine the Firefly Boardwalk with kayaking for bioluminescent plankton and additional firefly viewing.',
      points: [
        'The experience takes place after dark and includes a water component.',
        'Tide, weather and natural conditions can affect the experience.',
        'Keep noise low, avoid flash around fireflies and follow your guide.'
      ]
    },
    complete: {
      name: 'The Complete Experience',
      rate: 1000,
      intro: 'Combine the park’s three current visitor activities in one visit.',
      points: [
        'Includes the park’s current daytime and after-dark experience set.',
        'Exact sequence and timing are confirmed through the live booking system.',
        'All responsible-viewing and guide instructions apply throughout the visit.'
      ]
    }
  };

  const state = {
    step: 1,
    experience: '',
    visitDate: '',
    guests: 1,
    fullName: '',
    email: '',
    mobile: '',
    hotel: '',
    contactPreference: 'email',
    requests: '',
    reference: ''
  };

  const stepLabels = {
    1: 'Experience',
    2: 'What to Expect',
    3: 'Date & Time',
    4: 'Guests',
    5: 'Details',
    6: 'Review',
    7: 'Demo Payment',
    8: 'Confirmed'
  };

  const peso = (value) => `₱${Number(value || 0).toLocaleString('en-PH')}`;

  const todayLocalISO = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10);
  };

  dateInput.min = todayLocalISO();

  const selectedExperience = () =>
    document.querySelector('input[name="experience"]:checked')?.value || '';

  const readFormState = () => {
    state.experience = selectedExperience();
    state.visitDate = dateInput.value;
    state.guests = Math.max(1, Number.parseInt(guestInput.value, 10) || 1);
    state.fullName = form.elements.fullName?.value.trim() || '';
    state.email = form.elements.email?.value.trim() || '';
    state.mobile = form.elements.mobile?.value.trim() || '';
    state.hotel = form.elements.hotel?.value.trim() || '';
    state.contactPreference = form.elements.contactPreference?.value || 'email';
    state.requests = form.elements.requests?.value.trim() || '';
  };

  const currentRate = () => experienceData[state.experience]?.rate || 0;
  const currentTotal = () => currentRate() * state.guests;

  const formatDate = (iso) => {
    if (!iso) return '—';
    const [year, month, day] = iso.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const updateExpectation = () => {
    const exp = experienceData[state.experience];
    if (!exp) {
      if (expectationTitle) expectationTitle.textContent = 'Your experience';
      if (expectationIntro) expectationIntro.textContent = 'Choose an experience first to see the most relevant visitor notes.';
      if (expectationPrice) expectationPrice.textContent = '—';
      if (expectationPoints) expectationPoints.innerHTML = '';
      return;
    }

    if (expectationTitle) expectationTitle.textContent = exp.name;
    if (expectationIntro) expectationIntro.textContent = exp.intro;
    if (expectationPrice) expectationPrice.textContent = `${peso(exp.rate)} / person`;
    if (expectationPoints) {
      expectationPoints.innerHTML = exp.points.map((point) => `<li>${point}</li>`).join('');
    }
  };

  const updateSummary = () => {
    readFormState();

    const exp = experienceData[state.experience];
    document.getElementById('summary-experience-label').textContent =
      exp?.name || 'No experience selected';
    document.getElementById('summary-rate').textContent =
      exp ? `${peso(exp.rate)} / person` : '—';
    document.getElementById('summary-date').textContent =
      state.visitDate ? formatDate(state.visitDate) : '—';
    document.getElementById('summary-guests').textContent = String(state.guests);
    document.getElementById('summary-total').textContent = peso(currentTotal());

    const mobileStep = document.getElementById('booking-mobile-step');
    const mobileTotal = document.getElementById('booking-mobile-total');
    if (mobileStep) mobileStep.textContent = `Step ${state.step} of 8 · ${stepLabels[state.step]}`;
    if (mobileTotal) mobileTotal.textContent = peso(currentTotal());

    guestPlural.textContent = state.guests === 1 ? '' : 's';
    updateExpectation();
  };

  const setError = (message = '') => {
    errorBox.textContent = message;
  };

  const focusStepHeading = (stepNumber) => {
    const heading = document.querySelector(`[data-step="${stepNumber}"] h2`);
    window.setTimeout(() => heading?.focus({ preventScroll: true }), 60);
  };

  const showStep = (stepNumber, { focus = true } = {}) => {
    state.step = stepNumber;

    steps.forEach((step) => {
      const active = Number(step.dataset.step) === stepNumber;
      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });

    progressItems.forEach((item) => {
      const number = Number(item.dataset.progressStep);
      item.classList.toggle('is-active', number === stepNumber);
      item.classList.toggle('is-complete', number < stepNumber);
      if (number === stepNumber) {
        item.setAttribute('aria-current', 'step');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    setError('');
    updateSummary();
    window.scrollTo({
      top: Math.max(0, document.querySelector('.booking-workspace').offsetTop - 96),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });

    if (focus) focusStepHeading(stepNumber);
  };

  const validateStep = (stepNumber) => {
    readFormState();

    if (stepNumber === 1 && !state.experience) {
      setError('Please choose an experience before continuing.');
      return false;
    }

    if (stepNumber === 3) {
      if (!state.visitDate) {
        setError('Please choose a preferred visit date.');
        dateInput.focus();
        return false;
      }

      if (state.visitDate < todayLocalISO()) {
        setError('Please choose today or a future date for this prototype.');
        dateInput.focus();
        return false;
      }

      if (!form.elements.timePendingAck.checked) {
        setError('Please acknowledge that exact time slots will appear only when confirmed.');
        form.elements.timePendingAck.focus();
        return false;
      }
    }

    if (stepNumber === 4) {
      if (!Number.isFinite(state.guests) || state.guests < 1) {
        setError('Please enter at least one guest.');
        guestInput.focus();
        return false;
      }
    }

    if (stepNumber === 5) {
      const requiredFields = [
        form.elements.fullName,
        form.elements.email,
        form.elements.mobile
      ];

      for (const field of requiredFields) {
        if (!field.checkValidity()) {
          setError(`Please complete the ${field.labels?.[0]?.textContent?.trim().toLowerCase() || 'required'} field correctly.`);
          field.focus();
          return false;
        }
      }
    }

    if (stepNumber === 6 && !form.elements.reviewAck.checked) {
      setError('Please confirm that you have reviewed the prototype booking information.');
      form.elements.reviewAck.focus();
      return false;
    }

    return true;
  };

  const populateReview = () => {
    readFormState();
    const exp = experienceData[state.experience];

    document.getElementById('review-experience').textContent = exp?.name || '—';
    document.getElementById('review-date').textContent = formatDate(state.visitDate);
    document.getElementById('review-guest').textContent = state.fullName || '—';
    document.getElementById('review-email').textContent = state.email || '—';
    document.getElementById('review-mobile').textContent = state.mobile || '—';
    document.getElementById('review-rate').textContent =
      `${peso(exp?.rate || 0)} × ${state.guests} ${state.guests === 1 ? 'guest' : 'guests'}`;
    document.getElementById('review-total').textContent = peso(currentTotal());
    document.getElementById('payment-total').textContent = peso(currentTotal());
  };

  const generateReference = () => {
    const now = new Date();
    const y = String(now.getFullYear());
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const token = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `KP-DEMO-${y}${m}${d}-${token}`;
  };

  const populateConfirmation = () => {
    readFormState();
    const exp = experienceData[state.experience];
    state.reference = generateReference();

    document.getElementById('confirmation-reference').textContent = state.reference;
    document.getElementById('confirmation-name').textContent = state.fullName;
    document.getElementById('confirmation-experience').textContent = exp?.name || '—';
    document.getElementById('confirmation-date').textContent = formatDate(state.visitDate);
    document.getElementById('confirmation-guests').textContent =
      `${state.guests} ${state.guests === 1 ? 'guest' : 'guests'}`;
    document.getElementById('confirmation-total').textContent = peso(currentTotal());
  };

  nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!validateStep(state.step)) return;

      if (state.step === 5) populateReview();
      if (state.step === 6) {
        populateReview();
        document.getElementById('payment-total').textContent = peso(currentTotal());
      }

      showStep(Math.min(8, state.step + 1));
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showStep(Math.max(1, state.step - 1));
    });
  });

  document.querySelector('[data-guest-minus]')?.addEventListener('click', () => {
    const value = Math.max(1, (Number.parseInt(guestInput.value, 10) || 1) - 1);
    guestInput.value = value;
    updateSummary();
  });

  document.querySelector('[data-guest-plus]')?.addEventListener('click', () => {
    const value = Math.max(1, (Number.parseInt(guestInput.value, 10) || 1) + 1);
    guestInput.value = value;
    updateSummary();
  });

  form.addEventListener('input', updateSummary);
  form.addEventListener('change', updateSummary);

  document.getElementById('simulate-payment')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    const original = button.innerHTML;

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.innerHTML = 'SIMULATING SECURE CHECKOUT…';

    await new Promise((resolve) => window.setTimeout(resolve, 800));

    populateConfirmation();
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.innerHTML = original;
    showStep(8);
  });

  document.getElementById('print-summary')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('book-another')?.addEventListener('click', () => {
    form.reset();
    guestInput.value = 1;
    state.experience = '';
    state.visitDate = '';
    state.guests = 1;
    state.reference = '';
    applyExperienceFromURL();
    updateSummary();
    showStep(1);
  });

  const applyExperienceFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('experience');
    if (!requested || !experienceData[requested]) return;

    const radio = form.querySelector(`input[name="experience"][value="${CSS.escape(requested)}"]`);
    if (radio) {
      radio.checked = true;
      state.experience = requested;
    }
  };

  applyExperienceFromURL();
  updateSummary();
  showStep(1, { focus: false });
})();
