import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export function createClock(timeZone) {
    const clock = document.createElement("div");

    document.querySelector('#horloges').appendChild(clock);

    const text = document.createElement("p");

    text.innerHTML = timeZone;

    clock.appendChild(text);

    setInterval(() => {
        text.innerHTML = timeZone + ' : ' + format(
            utcToZonedTime(new Date(), timeZone),
            'h:mm:ss a'
        )
    });
}