import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Author from '../models/Author.js';

dotenv.config();

// 1. Author Data
const authorsData = [
  {
    name: "Mercedes Ron",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    bio: "Mercedes Ron is a Spanish-Argentine writer who achieved popularity on the online platform Wattpad before publishing her smash-hit Culpable romance trilogy.",
    field: "literature",
    isFeatured: true
  },
  {
    name: "James Clear",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "James Clear is an American author and speaker focused on habits, decision-making, and continuous self-improvement. His newsletter is read by millions weekly.",
    field: "finance", // classified for entrepreneurship/lifestyle
    isFeatured: true
  },
  {
    name: "Morgan Housel",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    bio: "Morgan Housel is a partner at Collaborative Fund and a former columnist for The Wall Street Journal and The Motley Fool. He writes about behavioral finance.",
    field: "finance",
    isFeatured: true
  },
  {
    name: "Robert Kiyosaki",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "Robert Kiyosaki is an American businessman, founder of Rich Global LLC, and personal finance educator best known for the Rich Dad Poor Dad franchise.",
    field: "finance",
    isFeatured: false
  },
  {
    name: "J.K. Rowling",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    bio: "Joanne Rowling is a British author, philanthropist, and screenwriter. She is best known for writing the seven-volume Harry Potter fantasy series.",
    field: "literature",
    isFeatured: true
  },
  {
    name: "Colleen Hoover",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    bio: "Colleen Hoover is an American author of romance and young adult fiction. She is currently one of the highest-selling novelists globally.",
    field: "literature",
    isFeatured: false
  },
  {
    name: "John Green",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
    bio: "John Green is an American author and YouTube creator. He won the Printz Award for his debut novel and topped the charts with The Fault in Our Stars.",
    field: "literature",
    isFeatured: false
  },
  {
    name: "Napoleon Hill",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    bio: "Oliver Napoleon Hill was an American self-help author. He is best known for his classic self-development book Think and Grow Rich.",
    field: "finance",
    isFeatured: false
  },
  {
    name: "Cal Newport",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    bio: "Cal Newport is an associate professor of computer science at Georgetown University and the author of multiple productivity and digital lifestyle guides.",
    field: "technology",
    isFeatured: true
  },
  {
    name: "Smriti Mandhana",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400", // professional portrait
    bio: "Smriti Mandhana is a world-class Indian cricketer who plays for the national team and captains the Royal Challengers Bangalore. She was named ICC Women's Cricketer of the Year twice.",
    field: "sports",
    isFeatured: true
  },
  {
    name: "Rithwik Singh",
    photo: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400",
    bio: "Rithwik Singh is a modern Indian poet and creative writer whose literature focuses on relationships, healing, heartbreak, self-love, and modern poetry.",
    field: "literature",
    isFeatured: true
  },
  {
    name: "Munshi Premchand",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
    bio: "Dhanpat Rai Srivastava, better known by his pen name Munshi Premchand, was an Indian writer famous for his modern Hindustani literature and stories.",
    field: "literature",
    isFeatured: false
  },
  {
    name: "Harivansh Rai Bachchan",
    photo: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=400",
    bio: "Harivansh Rai Bachchan was a distinguished Indian poet of the Nayi Kavita literary movement of Hindi literature, best known for Madhushala.",
    field: "literature",
    isFeatured: false
  },
  {
    name: "Héctor García",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    bio: "Héctor García is a citizen of Spain and Japan. He is the co-author of the global bestseller Ikigai: The Japanese Secret to a Long and Happy Life.",
    field: "creation",
    isFeatured: false
  },
  {
    name: "Paulo Coelho",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    bio: "Paulo Coelho is a Brazilian lyricist and novelist. He is the recipient of numerous international awards, best known for his symbolic novel The Alchemist.",
    field: "literature",
    isFeatured: false
  }
];

// 2. High-quality cover images for rotation
const coverImageUrls = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600",
  "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=600",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=600",
  "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=600",
  "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=600",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600",
  "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600",
  "https://images.unsplash.com/photo-1629992101753-56c1ebff3b49?w=600"
];

// 3. Core Bestsellers list
const coreBooks = [
  {
    title: "My Fault",
    author: "Mercedes Ron",
    description: "Noah is forced to leave her town, boyfriend, and friends to move into the mansion of her mother's new rich husband. There she meets Nick, her new stepbrother, and a secret romantic storm begins.",
    price: 350.00,
    category: "Romance",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    stock: 22,
    tags: ["Romance", "Stepbrother Romance", "Best Seller", "Wattpad"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Your Fault",
    author: "Mercedes Ron",
    description: "The sequel to My Fault. Nick and Noah's love is stronger than ever, but their relationship is filled with hurdles, threats, and ghosts from the past that they must defeat.",
    price: 350.00,
    category: "Romance",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600",
    stock: 15,
    tags: ["Romance", "Drama", "Sequel", "Bestseller"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Our Fault",
    author: "Mercedes Ron",
    description: "The thrilling conclusion of the Culpable trilogy. Nick and Noah face the ultimate test of survival and romance in this high-stakes romantic drama.",
    price: 380.00,
    category: "Romance",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    stock: 18,
    tags: ["Romance", "Trilogy Finale", "Bestseller"],
    isBestseller: true,
    isNewArrival: true
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    description: "Robert Kiyosaki's classic personal finance book. It explodes the myth that you need to earn a high income to become rich and explains the difference between working for money and having your money work for you.",
    price: 299.00,
    category: "Finance",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600",
    stock: 30,
    tags: ["Personal Finance", "Wealth", "Investment", "Business"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    price: 450.00,
    category: "Self Help",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600",
    stock: 45,
    tags: ["Productivity", "Habits", "Motivation", "Self Improvement"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Doing well with money isn't necessarily about what you know. It's about how you behave. Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
    price: 399.00,
    category: "Finance",
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600",
    stock: 25,
    tags: ["Behavioral Finance", "Psychology", "Investing", "Life Lessons"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Ikigai",
    author: "Héctor García",
    description: "Find your ikigai (Japanese secret to a long and happy life) and bring meaning and joy to all of your days. Explores longevity, mindfulness, and purpose.",
    price: 320.00,
    category: "Self Help",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    stock: 40,
    tags: ["Happiness", "Japan", "Longevity", "Lifestyle"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A magical fable about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure, teaching us about listening to our hearts and following dreams.",
    price: 299.00,
    category: "Novels",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
    stock: 50,
    tags: ["Spirituality", "Destiny", "Fable", "Classic"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Rithwik Singh", // assigned for demo or Mark Manson
    description: "A groundbreaking self-help guide that tells us to stop trying to be positive all the time so that we can truly find what is important in our lives.",
    price: 399.00,
    category: "Self Help",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600",
    stock: 20,
    tags: ["Realism", "Mental Health", "Humor", "Self Help"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "Harry Potter has no idea how famous he is until he receives a letter invite to Hogwarts School of Witchcraft and Wizardry, starting a magical adventure of a lifetime.",
    price: 499.00,
    category: "Fantasy",
    coverImage: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=600",
    stock: 35,
    tags: ["Magic", "Hogwarts", "Adventure", "Fantasy"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    description: "Harry Potter's second year at Hogwarts is filled with fresh fresh horrors and mysteries, as a legendary chamber is opened, turning students to stone.",
    price: 499.00,
    category: "Fantasy",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    stock: 20,
    tags: ["Magic", "Mystery", "Hogwarts", "Fantasy"],
    isBestseller: false,
    isNewArrival: false
  },
  {
    title: "It Ends With Us",
    author: "Colleen Hoover",
    description: "Lily hasn't always had it easy, but that's never stopped her from working hard for the life she wants. She meets handsome neurosurgeon Ryle Kincaid, starting a turbulent love story.",
    price: 350.00,
    category: "Romance",
    coverImage: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=600",
    stock: 25,
    tags: ["Romance", "Drama", "Bestseller", "TikTok"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "The Fault in Our Stars",
    author: "John Green",
    description: "Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal. Then Augustus Waters appears at Cancer Kid Support Group.",
    price: 299.00,
    category: "Young Adult",
    coverImage: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=600",
    stock: 18,
    tags: ["Young Adult", "Tragedy", "Romance", "Bestseller"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    description: "Think and Grow Rich is the most important financial self-help book ever written. Drawing on the wealth-building secrets of Carnegie, Ford, and others.",
    price: 199.00,
    category: "Motivation",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600",
    stock: 40,
    tags: ["Motivation", "Mindset", "Wealth Creation", "Classic"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    description: "One of the most valuable skills in our economy is becoming increasingly rare. If you master this skill, you'll achieve extraordinary results. Cal Newport teaches deep focus systems.",
    price: 420.00,
    category: "Personal Development",
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
    stock: 28,
    tags: ["Focus", "Productivity", "Tech Careers", "Self Help"],
    isBestseller: true,
    isNewArrival: true
  },
  {
    title: "Smriti Mandhana: Batter, Captain, Icon",
    author: "Smriti Mandhana",
    description: "The official biography of Smriti Mandhana. Follow her journey from Mumbai's streets to becoming the captain of RCB and a global icon of women's sports and cricket.",
    price: 399.00,
    category: "Sports Personalities",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
    stock: 35,
    tags: ["Cricket", "Sports Biography", "Smriti Mandhana", "Women Sports"],
    isBestseller: true,
    isNewArrival: true
  },
  {
    title: "I Don't Love You Anymore",
    author: "Rithwik Singh",
    description: "A moving compilation of poems and short notes by Rithwik Singh. It explores the painful trajectory of loving someone, losing them, and finding the strength to survive and heal.",
    price: 240.00,
    category: "Poetry",
    coverImage: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=600",
    stock: 25,
    tags: ["Hindi Poetry", "Modern Poetry", "Healing", "Relationships"],
    isBestseller: true,
    isNewArrival: true
  },
  {
    title: "Godaan",
    author: "Munshi Premchand",
    description: "Godaan (The Gift of a Cow) is a classic Hindi novel by Munshi Premchand. It deals with the socio-economic deprivation and exploitation of the poor peasantry in rural India.",
    price: 199.00,
    category: "Novels",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    stock: 15,
    tags: ["Hindi Novel", "Classic Literature", "Munshi Premchand", "Indian Literature"],
    isBestseller: true,
    isNewArrival: false
  },
  {
    title: "Gaban",
    author: "Munshi Premchand",
    description: "Gaban (Embezzlement) is one of the most popular Hindi novels by Munshi Premchand. It depicts the moral fall of a lower middle-class youth and the strength of his wife.",
    price: 180.00,
    category: "Novels",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
    stock: 12,
    tags: ["Hindi Novel", "Classic Literature", "Indian Society"],
    isBestseller: false,
    isNewArrival: true
  },
  {
    title: "Madhushala",
    author: "Harivansh Rai Bachchan",
    description: "Madhushala (The House of Wine) is a book of 135 quatrains (verses) by Harivansh Rai Bachchan. It is a highly celebrated work of Hindi poetry that uses the metaphor of a tavern, wine, and cup to explain life.",
    price: 220.00,
    category: "Poetry",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600",
    stock: 25,
    tags: ["Hindi Poetry", "Classic Poetry", "Madhushala", "Bachchan"],
    isBestseller: true,
    isNewArrival: false
  }
];

// Helper template arrays for generating the rest of the 200 books
const titleParts = {
  Novels: {
    prefix: ["The Secrets of", "Legends of", "A Quest for", "Shadows of", "Echos from", "Beyond the"],
    suffix: ["Cozy Valley", "Himalayan Wind", "Lost Sanctuary", "River of Dreams", "Ancient Library", "Whispering Pines"]
  },
  Romance: {
    prefix: ["Love in the time of", "Heartstrings in", "Whispers of", "A Promise of", "Starlit Nights in", "Unspoken"],
    suffix: ["Monsoon rains", "Delhi Café", "Cozy Nest", "Winter Frost", "Eternal Autumn", "Desires"]
  },
  Poetry: {
    prefix: ["Warmth of", "Silent verses from", "The Art of", "Shattered", "Petals from", "Feelings of"],
    suffix: ["Solitude", "My Heart", "Unspoken Words", "Delhi Evenings", "A Broken Soul", "Midnight Tears"]
  },
  "Self Help": {
    prefix: ["The Guide to", "Mastering the Art of", "How to Unlock", "Rules for", "Mindset of", "Pathway to"],
    suffix: ["Mindfulness", "Inner Peace", "Daily Systems", "Cozy Living", "Sustainable Habits", "Joyful Life"]
  },
  "Personal Development": {
    prefix: ["Designing Your", "Unstoppable", "The Productive", "Focus Systems of", "Growth hacks for", "Mastering"],
    suffix: ["Career", "Daily Routines", "Professional Life", "High Achievers", "Cognitive Capacity", "Focus"]
  },
  Business: {
    prefix: ["The Startup", "Scale Up", "Founders of", "Principles of", "The Corporate", "Innovate Like"],
    suffix: ["Strategy", "Industry Leaders", "Silicon Valley", "Sustainable Growth", "Niche Success", "Disruptors"]
  },
  Finance: {
    prefix: ["The Science of", "Secrets of", "Smart guide to", "Rules for", "Building your", "Understanding"],
    suffix: ["Compounding", "Passive Income", "Stock Portfolios", "Indian Markets", "Generational Wealth", "Assets"]
  },
  Biographies: {
    prefix: ["Life and Times of", "The Journey of", "Unmasked:", "Unheard Chronicles of", "Architect of", "Beyond limits:"],
    suffix: ["Visionaries", "Freedom Fighters", "Eminent Scholars", "Pioneers", "Industrialists", "Trailblazers"]
  },
  "Sports Personalities": {
    prefix: ["Play like", "The Drive of", "Stumped:", "Runs and", "Striking Gold with", "Captaincy of"],
    suffix: ["Champions", "On-Field Icons", "Cricket Legends", "Olympic Heroes", "Sports Prodigies", "Legends"]
  },
  Motivation: {
    prefix: ["Fire within", "Chasing the", "Unstoppable force of", "Dare to", "Believing in the", "Rise and"],
    suffix: ["Unbelievable", "Highest Peak", "Human Spirit", "Dream Big", "Power of Will", "Shine"]
  },
  Fiction: {
    prefix: ["Chronicles of", "The Strange case of", "Labyrinth of", "A Story of", "Tales from", "Inside the"],
    suffix: ["Parallel Worlds", "A Time Traveler", "Curious Minds", "Delhi Alleyways", "Forgotten Realms", "Nest"]
  },
  "Mystery & Thriller": {
    prefix: ["The Hidden", "Silent witness in", "A Cold Case of", "Behind closed", "Conspiracy in", "Deception of"],
    suffix: ["Clues", "Himalayan Slopes", "Midnight Theft", "Doors", "Corporate Corridors", "Lies"]
  },
  Fantasy: {
    prefix: ["The Sorcerer's", "Heir of the", "Kingdom of", "The Dragon's", "Scepter of", "Legend of the"],
    suffix: ["Mystic Wand", "Elven Forest", "Floating Castles", "Fire", "Forgotten Kingdoms", "Wizard"]
  },
  "Young Adult": {
    prefix: ["Adventures of a", "Confessions of", "Summer of", "The Teenage", "Delhi High School", "Growing up in"],
    suffix: ["Rebel teen", "Boarding school", "Heartbreaks", "Wanderer", "Chronicles", "Cozy Nests"]
  }
};

const seedDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/booknest';
    console.log(`Connecting to database for seeding: ${connStr}`);
    await mongoose.connect(connStr);

    // Wipe previous data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Author.deleteMany({});

    console.log('Database wiped successfully.');

    // 1. Create Detailed Authors
    const authors = await Author.insertMany(authorsData);
    console.log(`${authors.length} Authors inserted.`);

    // Map author name to ObjectId for easy lookup
    const authorMap = {};
    authors.forEach(auth => {
      authorMap[auth.name] = auth._id;
    });

    // Populate related authors for featured ones (cross-linking them)
    for (const auth of authors) {
      const related = authors
        .filter(a => a._id.toString() !== auth._id.toString() && a.field === auth.field)
        .map(a => a._id);
      
      auth.relatedAuthors = related.slice(0, 3);
      await auth.save();
    }
    console.log('Authors cross-linked.');

    // 2. Prepare Books Array
    const booksToInsert = [];

    // Add hand-crafted core books first
    coreBooks.forEach(b => {
      const authorId = authorMap[b.author];
      booksToInsert.push({
        ...b,
        authorRef: authorId || null
      });
    });

    // Generate remainder books to reach EXACTLY 210 books (more than 200)
    const genres = Object.keys(titleParts);
    let index = 0;
    const targetCount = 210;
    const currentCount = booksToInsert.length;

    for (let i = currentCount; i < targetCount; i++) {
      const category = genres[i % genres.length];
      const lists = titleParts[category];

      // Pick prefix and suffix in rotation to guarantee unique names
      const prefixIdx = (i + 3) % lists.prefix.length;
      const suffixIdx = (i + 7) % lists.suffix.length;
      const title = `${lists.prefix[prefixIdx]} ${lists.suffix[suffixIdx]} #${Math.ceil(i/genres.length)}`;

      // Pick a random author matching category/field if possible
      let matchingAuthor = authors[i % authors.length];
      if (category === 'Sports Personalities') {
        matchingAuthor = authors.find(a => a.field === 'sports') || matchingAuthor;
      } else if (category === 'Finance' || category === 'Business') {
        matchingAuthor = authors.find(a => a.field === 'finance') || matchingAuthor;
      } else if (category === 'Poetry') {
        matchingAuthor = authors.find(a => a.name === 'Rithwik Singh' || a.name === 'Harivansh Rai Bachchan') || matchingAuthor;
      }

      const price = Math.floor(Math.random() * (899 - 149) + 149); // ₹149 to ₹899
      const stock = Math.floor(Math.random() * (35 - 1) + 1); // 1 to 35
      const rating = Number((Math.random() * (5.0 - 3.8) + 3.8).toFixed(1)); // 3.8 to 5.0
      const coverImage = coverImageUrls[i % coverImageUrls.length];

      booksToInsert.push({
        title,
        author: matchingAuthor.name,
        authorRef: matchingAuthor._id,
        description: `An engaging and highly recommended read in the ${category} category, written by the celebrated expert ${matchingAuthor.name}. This book explores fundamental principles, stories, and practical insights designed to educate, inspire, and engage readers.`,
        price,
        category,
        coverImage,
        rating,
        reviewsCount: Math.floor(Math.random() * 45),
        stock,
        tags: [category, matchingAuthor.name.split(' ')[0], "Curated Read"],
        isBestseller: i % 7 === 0,
        isNewArrival: i % 9 === 0
      });
    }

    const insertedBooks = await Book.insertMany(booksToInsert);
    console.log(`Successfully seeded ${insertedBooks.length} books in the catalog!`);

    // 3. Create Default Users
    const adminUser = await User.create({
      name: "Elizabeth Bennet (Admin)",
      email: "admin@booknest.com",
      password: "admin123",
      role: "admin"
    });

    const regularUser = await User.create({
      name: "Arthur Dent",
      email: "user@booknest.com",
      password: "user123",
      role: "user"
    });
    console.log('Default sandbox login credentials initialized.');

    // 4. Seed some Reviews
    const reviewData = [
      {
        user: regularUser._id,
        book: insertedBooks[4]._id, // Atomic Habits or equivalent
        rating: 5,
        comment: "This book is pure gold! The structural habit loop makes total sense and works."
      },
      {
        user: regularUser._id,
        book: insertedBooks[0]._id, // My Fault
        rating: 5,
        comment: "The romance is hot, the plot is intense, couldn't stop reading it overnight!"
      },
      {
        user: adminUser._id,
        book: insertedBooks[0]._id, // My Fault
        rating: 4,
        comment: "Very engaging romantic storyline. Recommended for modern fiction lovers."
      },
      {
        user: regularUser._id,
        book: insertedBooks[5]._id, // Psychology of Money
        rating: 5,
        comment: " Morgan Housel's writing style is superb. Simple, deep, and mind-shifting."
      }
    ];

    const reviews = await Review.insertMany(reviewData);
    console.log(`${reviews.length} Reviews seeded.`);

    // 5. Create Historical Orders
    const now = new Date();
    const getPastDate = (monthsAgo) => {
      const d = new Date();
      d.setMonth(now.getMonth() - monthsAgo);
      return d;
    };

    const ordersData = [
      {
        user: regularUser._id,
        items: [
          { book: insertedBooks[0]._id, quantity: 1, price: insertedBooks[0].price },
          { book: insertedBooks[3]._id, quantity: 1, price: insertedBooks[3].price }
        ],
        totalAmount: insertedBooks[0].price + insertedBooks[3].price,
        shippingAddress: { street: "42 Wallaby Way", city: "Sydney", state: "NSW", zip: "2000", country: "Australia" },
        paymentStatus: "paid",
        orderStatus: "delivered",
        createdAt: getPastDate(5)
      },
      {
        user: regularUser._id,
        items: [
          { book: insertedBooks[4]._id, quantity: 2, price: insertedBooks[4].price }
        ],
        totalAmount: insertedBooks[4].price * 2,
        shippingAddress: { street: "Baker Street 221B", city: "London", state: "ENG", zip: "NW1 6XE", country: "United Kingdom" },
        paymentStatus: "paid",
        orderStatus: "delivered",
        createdAt: getPastDate(3)
      },
      {
        user: regularUser._id,
        items: [
          { book: insertedBooks[15]._id, quantity: 1, price: insertedBooks[15].price }
        ],
        totalAmount: insertedBooks[15].price,
        shippingAddress: { street: "12 Cozy Lane", city: "Mumbai", state: "MH", zip: "400001", country: "India" },
        paymentStatus: "paid",
        orderStatus: "delivered",
        createdAt: getPastDate(1)
      }
    ];

    await Order.insertMany(ordersData);
    console.log('Mock historical orders generated.');
    console.log('Seeding completed successfully!');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
