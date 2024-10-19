const prisma = require("./../models/index");

const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embed(dim, input) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input,
    encoding_format: "float",
  });

  return embedding.data[0].embedding.slice(0, dim);
}

function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce(
    (sum, value, index) => sum + value * vec2[index],
    0
  );
  const magnitudeA = Math.sqrt(
    vec1.reduce((sum, value) => sum + value * value, 0)
  );
  const magnitudeB = Math.sqrt(
    vec2.reduce((sum, value) => sum + value * value, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Handle case where one of the vectors is zero
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

const k_nearest = (k, interests, event) => {
  const similarities = interests.map((interest) => {
    const similarity = cosineSimilarity(event.embedding, interest.embedding);
    return {
      interest: interest,
      similarity: similarity,
    };
  });

  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, k).map((item) => {
    return { ...item.interest, embedding: undefined };
  });
};

async function main() {
  const interests = await prisma.interest.findMany();

  //   const interests_embedding = [];

  //   console.log("Started embedding interests!");

  for (let interest of interests) {
    const embedding = await embed(
      256,
      `${interest.name}: ${interest.description}`
    );
    // interests_embedding.push({
    //   id: interest.id,
    //   name: interest.name,
    //   description: interest.description,
    //   embedding,
    // });

    const result = await prisma.interest.update({
      where: {
        id: interest.id,
      },
      data: {
        embedding,
      },
    });
  }
  console.log("Finished embedding interests!");

  //   const events = await prisma.event.findMany();

  //   const event = events[0];
  //   console.log(event);

  //   for (let event of events) {
  //     const embedding = await embed(256, `${event.name}: ${event.description}`);
  //     event.embedding = embedding;

  //     console.log({ ...event, embedding: undefined });

  //     console.log(k_nearest(5, interests_embedding, event));
  //   }
}

main();
