function updateClock(town, timezone) {
    const clock = document.getElementById(town);
    const timeElement = clock.querySelector('.time');

    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: timezone });
        timeElement.textContent = currentTime;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateClock('london', 'Europe/London');
    updateClock('tokyo', 'Asia/Tokyo');
    updateClock('canberra', 'Australia/Sydney');
});
