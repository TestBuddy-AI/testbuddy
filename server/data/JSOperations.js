function sum(a, b) {
  return a + b;
}

function difference(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function division(a, b) {
  return a / b;
}

function nextDayOfTheWeek(currentDay) {
  if (currentDay >= 0 && currentDay <= 6) {
    if (currentDay < 6) {
      return sum(currentDay, 1);
    } else {
      return 0;
    }
  } else {
    throw Error(`Current day ${currentDay} is not valid!`);
  }
}

function previousDayOfTheWeek(currentDay) {
  if (currentDay >= 0 && currentDay <= 6) {
    if (currentDay > 0) {
      return difference(currentDay, 1);
    } else {
      return 6;
    }
  } else {
    throw Error(`Current day ${currentDay} is not valid!`);
  }
}

function minutesToHours(minutes) {
  return multiply(minutes, 60);
}

function millisecondsToMinutes(milliseconds) {
  return division(milliseconds, 60000);
}
