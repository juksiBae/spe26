import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBsd2bCA14pEWeRJ8_dfWP8B72EidhAH8w",
  authDomain: "optimistic-oasis-9cf5x.firebaseapp.com",
  projectId: "optimistic-oasis-9cf5x",
  storageBucket: "optimistic-oasis-9cf5x.firebasestorage.app",
  messagingSenderId: "949148058618",
  appId: "1:949148058618:web:3bc8e8dff6ee0b67a9da43",
};

// Initialize Firebase SDK with experimentalForceLongPolling to prevent iframe websocket blockages
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-0c9bac58-cea8-4b30-894a-d11d761b3f9c");
export { Timestamp };

// Initial news to seed if DB is empty
export const INITIAL_NEWS = [
  {
    title: "Sustaining the Seas — SPE PEM Akamigas SC Releases 200 Sea Turtles",
    date: "September 24, 2025",
    excerpt: "The SPE PEM Akamigas Student Chapter successfully conducted its flagship environmental conservation program, Back to Blue, releasing over 200 baby sea turtles back to their natural ocean habitat.",
    fullText: "The SPE PEM Akamigas Student Chapter successfully conducted its flagship environmental conservation program, 'Back to Blue' in partnership with local marine conservation authorities. Under this initiative, our members and volunteers gathered at the coastal conservation area to release over 200 endangered baby sea turtles (tukik) back into their natural ocean habitat. Beyond the release, the team conducted a coastal clean-up operation, removing plastics and debris, and hosted an awareness session for local fishers on marine ecology and biodiversity. This program exemplifies SPE's commitment to environmental stewardship and sustainable development, bridging technical energy focus with active marine conservation.",
    image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Inspiring the Future Generation — Energy4me at SMAN 2 Cepu",
    date: "October 4, 2025",
    excerpt: "The SPE PEM Akamigas Student Chapter successfully hosted its highly anticipated outreach program, Energy4me Vol.1, at SMAN 2 Cepu to inspire students about petroleum science and engineering.",
    fullText: "The SPE PEM Akamigas Student Chapter successfully hosted its highly anticipated outreach program, 'Energy4me Vol.1', at SMAN 2 Cepu. Energy4me is an SPE International educational program designed to introduce oil and gas science to high school students through interactive, hands-on experiments. Our team of student facilitators led workshops on topics like porosity, oil exploration, drilling mechanics, and energy transition concepts. By translating complex petroleum engineering principles into engaging, simplified models, we sparked deep curiosity among SMAN 2 Cepu students, preparing and encouraging them to become the future energy leaders of Indonesia.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Planting Seeds of Hope — SPE Mangrove at Grand Maerakaca",
    date: "November 8, 2025",
    excerpt: "On November 8, 2025, the SPE PEM Akamigas Student Chapter took a significant stride toward environmental restoration by planting 150 mangrove saplings at Grand Maerakaca, Semarang.",
    fullText: "On November 8, 2025, the SPE PEM Akamigas Student Chapter took a significant stride toward environmental restoration and climate action. Our team planted over 150 mangrove saplings in the Grand Maerakaca mangrove conservation area in Semarang. Mangroves play an indispensable role in coastal defense, preventing shoreline erosion, and absorbing massive amounts of carbon dioxide. This event, attended by over 30 chapter members, was organized to combat climate change, protect coastal ecosystems, and raise awareness among engineering students about the environmental footprint and the balance required in the future energy sector.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Driving Circular Economy — SPE Ecoenzyme Initiative",
    date: "December 15, 2025",
    excerpt: "The SPE PEM Akamigas Student Chapter recently reaffirmed its unwavering commitment to environmental sustainability through an organic ecoenzyme fermentation workshop.",
    fullText: "The SPE PEM Akamigas Student Chapter recently reaffirmed its unwavering commitment to environmental sustainability by conducting an Ecoenzyme Workshop in local Cepu neighborhoods. Ecoenzyme is a complex solution produced by fermenting fresh organic waste (such as fruit peels and vegetable scraps) with sugar and water. This fermented solution serves as a natural multipurpose cleaner, organic fertilizer, and pesticide. Our members taught local communities how to process household organic waste into ecoenzyme, fostering a local circular economy. This initiative reduces organic waste ending up in landfills and showcases how engineering students can apply biochemical concepts to solve everyday waste management challenges.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Empowering Special Talents — Serve & Volunteer Day",
    date: "January 10, 2026",
    excerpt: "The SPE PEM Akamigas Student Chapter recently organized a heartwarming community outreach program at a local special needs school (SLB) in Cepu.",
    fullText: "The SPE PEM Akamigas Student Chapter recently organized a heartwarming community outreach program, 'Serve & Volunteer Day', at the local Sekolah Luar Biasa (SLB) in Cepu. Our members volunteered their time to engage with children with special needs through creative art workshops, basic sensory games, music, and educational storytelling. The team also donated essential learning materials, books, and sensory toys to support the school's curriculum. This initiative represents the compassionate and humanitarian side of SPE PEM Akamigas, reminding us that true leadership and community development involve uplifting and empowering every single individual, especially those with special talents.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Lighting the Path for Innovation — SPE Goes to Village Vol. 2",
    date: "January 25, 2026",
    excerpt: "On January 25, 2026, the SPE PEM Akamigas Student Chapter successfully extended its educational outreach to a rural village in Blora, focusing on energy safety.",
    fullText: "On January 25, 2026, the SPE PEM Akamigas Student Chapter successfully extended its community educational outreach through 'SPE Goes to Village Vol. 2' in a rural village in Blora. Our members focused on imparting essential knowledge regarding energy safety, household electricity efficiency, safe LPG cylinder handling, and simple waste composting techniques. We held interactive demonstrations for village residents, distributed educational infographics, and installed energy-efficient solar-powered path lighting in dark public areas of the village. This project bridged the gap between academic energy studies and rural community empowerment, providing real, practical benefits to local households.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Fueling Curiosity — Energy4Me Vol.2 at SMAN 1 Blora",
    date: "February 7, 2026",
    excerpt: "On February 7, 2026, the SPE PEM Akamigas Student Chapter successfully launched Energy4Me Vol.2, engaging students in advanced drilling and energy concepts.",
    fullText: "On February 7, 2026, the SPE PEM Akamigas Student Chapter successfully launched 'Energy4Me Vol.2' at SMAN 1 Blora. Building upon the success of our first volume, this iteration introduced high schoolers to advanced concepts in reservoir engineering, geological modeling, and the integration of renewable energy sources. Through exciting competitions, mud-engineering demonstrations (using safe household ingredients to simulate drilling fluids), and direct mentoring sessions with senior PEM Akamigas petroleum students, the event drew massive interest. It succeeded in showcasing how modern engineering combines computer science, geology, physics, and sustainability to power our world.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Spreading Compassion — SERVE Vol. 2 in Magetan",
    date: "February 28, 2026",
    excerpt: "On February 28, 2026, the SPE PEM Akamigas Student Chapter observed the spirit of compassion by organizing a social charity and distribution drive in Magetan.",
    fullText: "On February 28, 2026, the SPE PEM Akamigas Student Chapter observed the spirit of compassion and corporate social responsibility by organizing 'SERVE Vol. 2' in Magetan, East Java. Our team distributed daily food parcels (sembako), books, hygiene kits, and warm clothing to underprivileged families and elderly residents in remote mountainous sub-districts. Additionally, we conducted interactive energy-safety workshops for village administrators and local youth. This initiative reinforces the core values of our chapter: that engineering excellence must go hand-in-hand with empathy, social responsibility, and community welfare.",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_REWARDS = [
  {
    title: "Outstanding Student Chapter Award",
    category: "SPE International Award",
    year: "2025",
    description: "The highest international honor bestowed by SPE International to student chapters, recognizing exemplary performance in technology dissemination, community outreach, and professional development.",
    image: "spe_reward_trophy_1782742761615"
  },
  {
    title: "Student Chapter Excellence Award",
    category: "SPE International Award",
    year: "2024",
    description: "Honored for exceptional technical program execution, outstanding industry guest lectures, and highly engaged member programs throughout the Asia Pacific region.",
    image: "https://images.unsplash.com/photo-1578269174936-2709b5a12368?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "1st Place - National Smart Competition",
    category: "National Oil & Gas Competition",
    year: "2025",
    description: "Achieved first place in the prestigious integrated smart energy competition, demonstrating superior knowledge in reservoir, drilling, and production operations.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "2nd Place - Scientific Paper Competition",
    category: "National Petroleum Competition",
    year: "2025",
    description: "Recognized for an outstanding scientific paper addressing CCUS (Carbon Capture, Utilization, and Storage) implementation in mature Indonesian oil fields.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
  }
];

export const INITIAL_SLIDES = [
  {
    title: "Society of Petroleum Engineers",
    accentTitle: "Petroleum Engineers",
    subtitle: "Student Chapter · PEM Akamigas",
    description: "Building the future of energy through technical competency development, global professional networking, and sustainable innovation for students and young professionals in the energy industry.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    cta1: "About SPE",
    cta1Link: "about",
    cta2: "SPE PEM SC",
    cta2Link: "akamigas"
  },
  {
    title: "SPE PEM Akamigas SC",
    accentTitle: "Akamigas SC",
    subtitle: "Established 2017 · Game Changer of Energy",
    description: "We aim to elevate the understanding of global energy sources — from foundational petroleum sciences to cutting-edge clean-tech innovations. Empowering energy pioneers through #NexusInAction.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    cta1: "Explore Chapter",
    cta1Link: "akamigas",
    cta2: "#NexusInAction",
    cta2Link: "nexus"
  },
  {
    title: "SPE Outstanding Student Chapter Award",
    accentTitle: "Outstanding Award",
    subtitle: "Honoring Excellence & Global Recognition",
    description: "Celebrating our achievements! SPE PEM Akamigas SC has been awarded the prestigious Outstanding Student Chapter Award for our technical programs, community impact, and dedication to the future of energy.",
    image: "spe_reward_trophy_1782742761615",
    cta1: "Our Achievements",
    cta1Link: "akamigas",
    cta2: "",
    cta2Link: "",
    imageLayout: "split"
  }
];

// Seed Database Client-Side if collections are empty
export async function seedDatabaseClient() {
  try {
    const newsCol = collection(db, 'news');
    const newsSnap = await getDocs(query(newsCol, limit(1)));
    if (newsSnap.empty) {
      console.log("Seeding client-side news...");
      for (const item of INITIAL_NEWS) {
        await addDoc(newsCol, {
          ...item,
          createdAt: Timestamp.now()
        });
      }
    }

    const slidesCol = collection(db, 'hero_slides');
    const slidesSnap = await getDocs(slidesCol);
    if (slidesSnap.empty) {
      console.log("Seeding client-side slides...");
      for (const item of INITIAL_SLIDES) {
        await addDoc(slidesCol, {
          ...item,
          createdAt: Timestamp.now()
        });
      }
    } else {
      const rewardSlideTitle = "SPE Outstanding Student Chapter Award";
      let rewardExists = false;
      slidesSnap.forEach((docSnap) => {
        if (docSnap.data().title === rewardSlideTitle) {
          rewardExists = true;
        }
      });
      if (!rewardExists) {
        console.log("Seeding outstanding reward slide...");
        const rewardSlide = INITIAL_SLIDES.find(s => s.title === rewardSlideTitle);
        if (rewardSlide) {
          await addDoc(slidesCol, {
            ...rewardSlide,
            createdAt: Timestamp.now()
          });
        }
      }
    }

    // Seed Rewards
    const rewardsCol = collection(db, 'rewards');
    const rewardsSnap = await getDocs(query(rewardsCol, limit(1)));
    if (rewardsSnap.empty) {
      console.log("Seeding client-side rewards...");
      for (const item of INITIAL_REWARDS) {
        await addDoc(rewardsCol, {
          ...item,
          createdAt: Timestamp.now(),
          isDeleted: false
        });
      }
    }
  } catch (err) {
    console.error("Error seeding client-side database:", err);
  }
}
