const natural = require("natural");

const preprocessText = (text) => {
  const lowercaseText = text.toLowerCase();
  const alphanumericText = lowercaseText
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ");
  const stopWords = new Set([
    "a",
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "am",
    "an",
    "and",
    "any",
    "are",
    "aren't",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "below",
    "between",
    "both",
    "but",
    "by",
    "can't",
    "cannot",
    "could",
    "couldn't",
    "did",
    "didn't",
    "do",
    "does",
    "doesn't",
    "doing",
    "don't",
    "down",
    "during",
    "each",
    "few",
    "for",
    "from",
    "further",
    "had",
    "hadn't",
    "has",
    "hasn't",
    "have",
    "haven't",
    "having",
    "he",
    "he'd",
    "he'll",
    "he's",
    "her",
    "here",
    "here's",
    "hers",
    "herself",
    "him",
    "himself",
    "his",
    "how",
    "how's",
    "i",
    "i'd",
    "i'll",
    "i'm",
    "i've",
    "if",
    "in",
    "into",
    "is",
    "isn't",
    "it",
    "it's",
    "its",
    "itself",
    "let's",
    "me",
    "more",
    "most",
    "mustn't",
    "my",
    "myself",
    "no",
    "nor",
    "not",
    "of",
    "off",
    "on",
    "once",
    "only",
    "or",
    "other",
    "ought",
    "our",
    "ours",
    "ourselves",
    "out",
    "over",
    "own",
    "same",
    "shan't",
    "she",
    "she'd",
    "she'll",
    "she's",
    "should",
    "shouldn't",
    "so",
    "some",
    "such",
    "than",
    "that",
    "that's",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "there's",
    "these",
    "they",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "this",
    "those",
    "through",
    "to",
    "too",
    "under",
    "until",
    "up",
    "very",
    "was",
    "wasn't",
    "we",
    "we'd",
    "we'll",
    "we're",
    "we've",
    "were",
    "weren't",
    "what",
    "what's",
    "when",
    "when's",
    "where",
    "where's",
    "which",
    "while",
    "who",
    "who's",
    "whom",
    "why",
    "why's",
    "with",
    "won't",
    "would",
    "wouldn't",
    "you",
    "you'd",
    "you'll",
    "you're",
    "you've",
    "your",
    "yours",
    "yourself",
    "yourselves",
  ]);

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
