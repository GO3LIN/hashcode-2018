const fs = require('fs');

class Point {
  constructor(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }
}

class Car {
  constructor(position) {
    this.position = position;
    this.priority = [];
    this.consumption = 0;
  }
}

class Ride {
  constructor(id, startPoint, endPoint, startTime, endTime) {
    this.id = id;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.startTime = parseInt(startTime);
    this.endTime = parseInt(endTime);
    this.prioritized = false;
  }

  attributeToCar(car, cost) {
    car.priority.push(this);
    car.position = this.endPoint;
    car.consumption += cost;
    this.prioritized = true;
  }
}


readRides = (lines) => {
  ret = [];
  for (i = 0; i < lines.length; i++) {
    ll = lines[i].split(' ');
    ret.push(new Ride(i, new Point(ll[0], ll[1]), new Point(ll[2], ll[3]), ll[4], ll[5]));
  }
  return ret;
}

readCars = (n) => {
  ret = [];
  for (i = 0; i < n; i++) {
    ret.push(new Car(new Point(0, 0)));
  }
  return ret;
}

distance = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

calculateCost = (car, ride) => {
  return ride.startTime + distance(car.position, ride.startPoint) + distance(ride.startPoint, ride.endPoint) + car.consumption;
}

// calculateTotalConsumption = (cars) => {
//   sum = 0;
//   for (i = 0; i < cars.length; i++) {
//     sum += cars[i].consumption;
//   }
//   return sum;
// }

prioritizeRides = (cars, rides) => {
  min_cost = Infinity;
  for (i = 0; i < rides.length; i++) {
    if (!rides[i].prioritized) {
      for (j = 0; j < cars.length; j++) {
        cost = calculateCost(cars[j], rides[i]);
        if (cost < min_cost) {
          min_cost = cost;
          min_car = j;
          min_ride = i;
        }
      }
    }
  }
  rides[min_ride].attributeToCar(cars[min_car], min_cost);
}

printRides = (cars) => {
  out = '';
  for (i = 0; i < cars.length; i++) {
    if (cars[i].priority.length > 0) {
      out += cars[i].priority.length + ' ' + cars[i].priority.map(p => p.id).join(' ') + '\n';
    }
  }
  return out;
}

fs.readFile('e_high_bonus.in', 'utf8', function(err, contents) {
  let lines = contents.trim().split('\n');
  const [R, C, F, N, B, T] = lines[0].split(' ')
  lines.shift()
  rides = readRides(lines);
  cars = readCars(F);
  while (rides.filter(r => r.prioritized === false).length > 0) {
    prioritizeRides(cars, rides);
  }
  fs.writeFile("e_high_bonus.out", printRides(cars), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
});