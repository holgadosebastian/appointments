Array.prototype.getRandom = function () {
  return this[Math.floor(this.length * Math.random())]
}

const today = new Date();

const at = hours => today.setHours(hours, 0);

const firstNames = ['Sebastian', 'Brad', 'John', 'Sarah', 'Leia', 'Darth'];
const lastNames = ['Vader', 'Smith', 'Musk', 'Developer', 'Something'];
const stylists = ['Superman', 'Deborah', 'Luis', 'Miguel', 'Clara'];
const services = ['Cut', 'Dry', 'Wash', 'Clean'];

const getRandomCustomer = () => {
  return {
    firstName: firstNames.getRandom(),
    lasttName: lastNames.getRandom(),
  }
}

const getAppointmentData = () => {
  return {
    customer: getRandomCustomer(),
    stylist: stylists.getRandom(),
    service: services.getRandom(),
    phoneNumner: "157 88 2323 2323",
    notes: "Lorem ipsum text"
  }
}

export const sampleAppointments = [
  {
    startsAt: at(9),
    ...getAppointmentData(),
  },
  {
    startsAt: at(10),
    ...getAppointmentData(),
  },
  {
    startsAt: at(11),
    ...getAppointmentData(),
  },
  {
    startsAt: at(12),
    ...getAppointmentData(),
  },
  {
    startsAt: at(13),
    ...getAppointmentData(),
  },
  {
    startsAt: at(14),
    ...getAppointmentData(),
  },
  {
    startsAt: at(15),
    ...getAppointmentData(),
  },
  {
    startsAt: at(16),
    ...getAppointmentData(),
  },
  {
    startsAt: at(17),
    ...getAppointmentData(),
  },
]