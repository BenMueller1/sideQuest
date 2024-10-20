const prisma = require("./../models/index");

function euclideanDistance(vec1, vec2) {
  return Math.sqrt(
    vec1.reduce((sum, val, i) => sum + Math.pow(val - vec2[i], 2), 0)
  );
}

const bucketByEvent = (embarkations) => {
  let eventSignups = {};

  for (let embarkation of embarkations) {
    let eventId = embarkation.eventId;

    if (eventId in eventSignups) {
      eventSignups[eventId].push(embarkation);
    } else {
      eventSignups[eventId] = [embarkation];
    }
  }

  return eventSignups;
};

function initializeCentroids(data, k) {
  const centroids = [];
  const usedIndices = new Set();

  while (centroids.length < k) {
    const randIndex = Math.floor(Math.random() * data.length);
    if (!usedIndices.has(randIndex)) {
      centroids.push(data[randIndex].user.personaEmbedding);
      usedIndices.add(randIndex);
    }
  }

  return centroids;
}

function assignClustersWithCapacity(data, centroids, maxCapacity) {
  const clusters = Array(centroids.length)
    .fill(null)
    .map(() => []);
  const assignments = Array(data.length).fill(null);
  const capacities = Array(centroids.length).fill(0);

  for (let i = 0; i < data.length; i++) {
    let minDist = Infinity;
    let clusterIndex = -1;

    // Find the nearest cluster that is not full
    for (let j = 0; j < centroids.length; j++) {
      if (capacities[j] < maxCapacity) {
        const dist = euclideanDistance(
          data[i].user.personaEmbedding,
          centroids[j]
        );
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = j;
        }
      }
    }

    if (clusterIndex !== -1) {
      clusters[clusterIndex].push(data[i]);
      capacities[clusterIndex]++;
      assignments[i] = clusterIndex;
    }
  }

  return { clusters, assignments };
}

function reassignExcessPoints(data, assignments, centroids, maxCapacity) {
  const capacities = Array(centroids.length).fill(0);
  const newAssignments = [...assignments];

  for (let i = 0; i < assignments.length; i++) {
    const clusterIndex = assignments[i];
    if (capacities[clusterIndex] < maxCapacity) {
      capacities[clusterIndex]++;
    } else {
      // If the cluster is full, find another available cluster
      let minDist = Infinity;
      let newClusterIndex = -1;

      for (let j = 0; j < centroids.length; j++) {
        if (capacities[j] < maxCapacity) {
          const dist = euclideanDistance(
            data[i].user.personaEmbedding,
            centroids[j]
          );
          if (dist < minDist) {
            minDist = dist;
            newClusterIndex = j;
          }
        }
      }

      if (newClusterIndex !== -1) {
        newAssignments[i] = newClusterIndex;
        capacities[newClusterIndex]++;
      }
    }
  }

  return newAssignments;
}

function updateCentroids(data, clusters, k) {
  const newCentroids = Array(k)
    .fill(0)
    .map(() => Array(data[0].user.personaEmbedding.length).fill(0));

  const counts = Array(k).fill(0);

  for (let i = 0; i < data.length; i++) {
    const clusterIndex = clusters[i];
    counts[clusterIndex]++;
    for (let j = 0; j < data[i].user.personaEmbedding.length; j++) {
      newCentroids[clusterIndex][j] += data[i].user.personaEmbedding[j];
    }
  }

  for (let i = 0; i < k; i++) {
    if (counts[i] > 0) {
      for (let j = 0; j < newCentroids[i].length; j++) {
        newCentroids[i][j] /= counts[i]; // Compute the mean
      }
    }
  }

  return newCentroids;
}

const kMeans = (data, k, maxIterations = 25, capacity) => {
  let centroids = initializeCentroids(data, k);
  let { clusters, assignments } = assignClustersWithCapacity(
    data,
    centroids,
    capacity
  );
  let iterations = 0;

  while (iterations < maxIterations) {
    const newAssignments = reassignExcessPoints(
      data,
      assignments,
      centroids,
      capacity
    );
    const newCentroids = updateCentroids(data, newAssignments, k);

    if (
      JSON.stringify(centroids) === JSON.stringify(newCentroids) &&
      JSON.stringify(assignments) === JSON.stringify(newAssignments)
    ) {
      break;
    }

    if (JSON.stringify(centroids) === JSON.stringify(newCentroids)) {
      break;
    }

    centroids = newCentroids;
    assignments = newAssignments;
    iterations++;
  }

  const result = data.map((item, index) => ({
    id: item.userId,
    cluster: assignments[index],
    // personaEmbedding: item.personaEmbedding,
  }));

  //   return { centroids, result };
  return result;
};

async function matchingService() {
  try {
    const embarkations = await prisma.embarkation.findMany({
      include: { user: { select: { personaEmbedding: true } } },
    });

    const eventSignups = bucketByEvent(embarkations);

    for (let [eventId, signups] of Object.entries(eventSignups)) {
      const event = await prisma.event.findUnique({
        where: {
          id: parseInt(eventId),
        },
      });

      const k = Math.ceil(signups.length / event.capacity);

      const groups = kMeans(signups, k, 10, event.capacity);

      const buckets = groups.reduce((acc, item) => {
        if (!acc[item.cluster]) {
          acc[item.cluster] = [];
        }

        // Push the item into the appropriate cluster bucket
        acc[item.cluster].push(item);

        return acc;
      }, {});

      for (let [cluster, bucket] of Object.entries(buckets)) {
        const ids = bucket.map((bucket) => bucket.id);

        const group = await prisma.group.create({
          data: {
            eventId: parseInt(eventId),
            users: {
              connect: ids.map((id) => ({ id })),
            },
          },
        });
      }

      const removedEmbarkations = await prisma.embarkation.deleteMany({
        where: { eventId: parseInt(eventId) },
      });
    }
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = matchingService;
