const today = new Date();

const at = hours => today.setHours(hours, 0);

export const sampleAppointments = [
  {
    startsAt: at(9),
    customer: {
      firstName: "Charlie",
    }
  },
  {
    startsAt: at(10),
    customer: {
      firstName: "Sebastian",
    }
  },
  {
    startsAt: at(11),
    customer: {
      firstName: "Tom",
    }
  },
  {
    startsAt: at(12),
    customer: {
      firstName: "Cat",
    }
  },
  {
    startsAt: at(13),
    customer: {
      firstName: "Superman",
    }
  },
  {
    startsAt: at(14),
    customer: {
      firstName: "Robert",
    }
  },
  {
    startsAt: at(15),
    customer: {
      firstName: "Marie-Claude",
    }
  },
  {
    startsAt: at(16),
    customer: {
      firstName: "Rupert",
    }
  },
  {
    startsAt: at(17),
    customer: {
      firstName: "Harry",
    }
  },
]