const cron = require("node-cron");
const prisma = require("./../models/index");

const bucketByEvent = (embarkations) => {
  let eventSignups = {};

  for (let embarkation in embarkations) {
    let eventId = embarkation.eventId;

    if (eventId in eventSignups) {
      eventSignups[eventId].append(embarkation);
    } else {
      eventSignups[eventId] = [embarkation];
    }
  }

  return eventSignups;
};

async function matchingService() {
  try {
    const embarkations = await prisma.embarkations.findMany();

    const eventSignups = bucketByEvent(embarkations);

    for (let eventEmbarkments of eventSignups) {
    }
  } catch (error) {
    console.error(error.message);
  }
}

cron.schedule("0 12 * * *", () => {
  console.log("Matching embarkations into groups");
});

module.exports = cron;
