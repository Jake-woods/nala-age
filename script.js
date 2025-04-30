// --- Configuration ---
const dogBirthDate = new Date(2025, 1, 14, 0, 0, 0); // Month is 0-indexed (1 = Feb), set time to midnight

// --- Constants ---
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;
const AVG_DAYS_PER_MONTH = 365.25 / 12; // Average including leap years
const MS_PER_MONTH_AVG = MS_PER_DAY * AVG_DAYS_PER_MONTH;
const MS_PER_YEAR_AVG = MS_PER_DAY * 365.25;

// --- Elements ---
const ageElementYMD = document.getElementById('dog-age-ymd');
const ageElementYears = document.getElementById('dog-age-years');
const ageElementMonths = document.getElementById('dog-age-months');
const ageElementWeeks = document.getElementById('dog-age-weeks');
const ageElementDays = document.getElementById('dog-age-days');
const countdownElement = document.getElementById('dog-countdown');
const countdownContainer = document.getElementById('countdown');

// --- Functions ---

function calculateAndDisplayAge() {
    const now = new Date();

    // --- Handle Future Birth Date ---
    if (now < dogBirthDate) {
        const timeToBirth = dogBirthDate - now;
        const daysToBirth = Math.floor(timeToBirth / MS_PER_DAY); // Use floor for whole days
        const hoursToBirth = Math.floor((timeToBirth % MS_PER_DAY) / MS_PER_HOUR);
        const minutesToBirth = Math.floor((timeToBirth % MS_PER_HOUR) / MS_PER_MINUTE);
        const secondsToBirth = Math.floor((timeToBirth % MS_PER_MINUTE) / MS_PER_SECOND);


        countdownElement.textContent =
            `${daysToBirth}d ${hoursToBirth}h ${minutesToBirth}m ${secondsToBirth}s`;
        countdownContainer.style.display = 'flex'; // Show countdown (use flex to match .age-display)

        // Hide or clear age displays
        ageElementYMD.textContent = "Not born yet!";
        ageElementYears.textContent = "0";
        ageElementMonths.textContent = "0";
        ageElementWeeks.textContent = "0";
        ageElementDays.textContent = "0";

        // Optionally hide other age displays if countdown is active
        ageElementYMD.closest('.age-display').style.display = 'none';
        ageElementYears.closest('.age-display').style.display = 'none';
        ageElementMonths.closest('.age-display').style.display = 'none';
        ageElementWeeks.closest('.age-display').style.display = 'none';
        ageElementDays.closest('.age-display').style.display = 'none';


        return; // Stop further calculation
    }

    // --- Calculate Age Components ---
    // Ensure countdown is hidden and age displays are visible if born
    countdownContainer.style.display = 'none';
    ageElementYMD.closest('.age-display').style.display = 'flex';
    ageElementYears.closest('.age-display').style.display = 'flex';
    ageElementMonths.closest('.age-display').style.display = 'flex';
    ageElementWeeks.closest('.age-display').style.display = 'flex';
    ageElementDays.closest('.age-display').style.display = 'flex';


    // 1. Years, Months, Days Calculation (More Precise)
    let years = now.getFullYear() - dogBirthDate.getFullYear();
    let months = now.getMonth() - dogBirthDate.getMonth();
    let days = now.getDate() - dogBirthDate.getDate();

    if (days < 0) {
        months--;
        const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += daysInLastMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // --- Build the age string --- (Years, Months, Days)
    let ageStringPartsYMD = [];
    // Always add the years part, even if it's 0
    ageStringPartsYMD.push(`${years} year${years !== 1 ? 's' : ''}`); // Use !== 1 to handle 0 years correctly

    if (months > 0) {
        ageStringPartsYMD.push(`${months} month${months > 1 ? 's' : ''}`);
    }
    // Show days if it's positive, or if years and months are both zero (i.e., less than a month old)
    // Also show days if years > 0 or months > 0 but days is 0 (e.g., exactly 1 year old)
    if (days > 0 || (years === 0 && months === 0) || ((years > 0 || months > 0) && days === 0)) {
        if (days === 0 && years === 0 && months === 0 && now.toDateString() === dogBirthDate.toDateString()) {
            // Handle the "born today" case specifically later
            ageStringPartsYMD.push("less than a day"); // Placeholder, will be overridden
        } else {
            // Add days part only if it's not the "less than a day" case handled above
            // And only if days is not 0 unless it's the only unit (e.g. < 1 month old)
            if (!(days === 0 && years === 0 && months === 0)) {
                // Add '0 days' if years or months are present but days is 0
                if (days === 0 && (years > 0 || months > 0)) {
                    ageStringPartsYMD.push(`0 days`);
                } else if (days > 0) {
                    ageStringPartsYMD.push(`${days} day${days !== 1 ? 's' : ''}`);
                }
            }
        }
    }

    // Join the parts
    let finalAgeStringYMD = ageStringPartsYMD.join(', ');

    // Handle the edge case where the dog is exactly 0 years, 0 months, 0 days (born today)
    if (years === 0 && months === 0 && days === 0 && now.toDateString() === dogBirthDate.toDateString()) {
        finalAgeStringYMD = "Less than a day old"; // Override the potentially long "0 years, less than a day"
    } else if (finalAgeStringYMD.includes("less than a day")) {
        // Clean up if "less than a day" was added incorrectly (e.g., if months > 0)
        finalAgeStringYMD = finalAgeStringYMD.replace(', less than a day', '');
        if (days === 0) finalAgeStringYMD += ', 0 days'; // Add 0 days if needed
    }


    // Display the result for YMD
    ageElementYMD.textContent = finalAgeStringYMD || "Calculating..."; // Fallback


    // 2. Total Time Difference Calculations
    const diffInMs = now - dogBirthDate;

    const totalDays = Math.floor(diffInMs / MS_PER_DAY);
    const totalWeeks = (diffInMs / MS_PER_WEEK).toFixed(2); // Show decimals for weeks
    const totalMonths = (diffInMs / MS_PER_MONTH_AVG).toFixed(1); // Approx, show decimal
    const totalYears = (diffInMs / MS_PER_YEAR_AVG).toFixed(2); // Approx, show decimals

    // --- Update HTML Elements ---
    ageElementYears.textContent = totalYears;
    ageElementMonths.textContent = totalMonths;
    ageElementWeeks.textContent = totalWeeks;
    ageElementDays.textContent = totalDays.toString(); // toString() just to be explicit

}

// --- Initial Calculation & Update Interval ---
calculateAndDisplayAge(); // Calculate age immediately on load

// Update the age every second
setInterval(calculateAndDisplayAge, 1000);
