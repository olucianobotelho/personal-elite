document.addEventListener('DOMContentLoaded', () => {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    // Check if there's a saved end time in localStorage
    let endTime = localStorage.getItem('offerEndTime');

    // If no saved end time or it has passed, set a new one (15 minutes from now)
    if (!endTime || new Date(parseInt(endTime)) <= new Date()) {
        endTime = new Date().getTime() + (15 * 60 * 1000); // 15 minutes
        localStorage.setItem('offerEndTime', endTime);
    }

    function updateTimer() {
        const now = new Date().getTime();
        const distance = endTime - now;

        // If countdown is finished
        if (distance < 0) {
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }

        // Calculate time units
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM with padded numbers
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    // Update timer immediately and then every second
    updateTimer();
    setInterval(updateTimer, 1000);
});