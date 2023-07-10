const natural = require("natural");
const stopWords = require("./stopWords");

const preprocessText = (text) => {
  const lowercaseText = text.toLowerCase();
  const alphanumericText = lowercaseText
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ");

  const stopwordTokenizer = new natural.WordTokenizer().tokenize(
    alphanumericText
  );
  const filteredTokens = stopwordTokenizer.filter(
    (token) => !stopWords.has(token)
  );
  return filteredTokens.join(" ");
};

const calculateCosineSimilarity = (vector1, vector2) => {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    norm1 += vector1[i] ** 2;
    norm2 += vector2[i] ** 2;
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
  tfidfVectorizer.addDocument(resumeTokens);
  tfidfVectorizer.addDocument(jobDescriptionTokens);

  // Get TF-IDF vectors
  const resumeVector = tfidfVectorizer.tfidfs(resumeTokens);
  const jobDescriptionVector = tfidfVectorizer.tfidfs(jobDescriptionTokens);

  // Calculate the cosine similarity between the vectors
  const cosineSimilarity = calculateCosineSimilarity(
    jobDescriptionVector,
    resumeVector
  );

  return (cosineSimilarity * 100).toFixed(2);
};

module.exports = scanHelper;
