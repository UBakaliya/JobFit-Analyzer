const natural = require("natural");
const stopWords = require("./stopWords");

// Clear the text
const preprocessText = (text) => {
  const lowercaseText = text.toLowerCase();
  const alphanumericText = lowercaseText
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ");

  const stopwordTokenizer = new natural.WordTokenizer();
  const filteredTokens = stopwordTokenizer
    .tokenize(alphanumericText)
    .filter((token) => !stopWords.has(token));

  return filteredTokens.join(" ");
};

const calculateCosineSimilarity = (vector1, vector2) => {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vector1.length; i++) {
    const val1 = vector1[i];
    const val2 = vector2[i];

    dotProduct += val1 * val2;
    norm1 += val1 ** 2;
    norm2 += val2 ** 2;
  }

  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  return similarity;
};

const scanHelper = (resume, jobDescription) => {
  // Tokenize the resume and job description into individual words
  const tokenizer = new natural.WordTokenizer();
  const resumeTokens = tokenizer.tokenize(preprocessText(resume));
  const jobDescriptionTokens = tokenizer.tokenize(
    preprocessText(jobDescription)
  );

  // Create TF-IDF vectorizers
  const tfidfVectorizer = new natural.TfIdf();

  // Add documents to the vectorizers
  tfidfVectorizer.addDocument(resumeTokens.join(" "));
  tfidfVectorizer.addDocument(jobDescriptionTokens.join(" "));

  // Get TF-IDF vectors
  const resumeVector = tfidfVectorizer.tfidfs(resumeTokens.join(" "));
  const jobDescriptionVector = tfidfVectorizer.tfidfs(
    jobDescriptionTokens.join(" ")
  );

  // Calculate the cosine similarity between the vectors
  const cosineSimilarity = calculateCosineSimilarity(
    jobDescriptionVector,
    resumeVector
  );

  return (cosineSimilarity * 100).toFixed(2);
};

module.exports = scanHelper;
