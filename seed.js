import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBll5zwC4i3dVwZ3oCyBe1YSXYKNAtqe7I",
  authDomain: "brewlytics-app-prototype.firebaseapp.com",
  projectId: "brewlytics-app-prototype",
  storageBucket: "brewlytics-app-prototype.firebasestorage.app",
  messagingSenderId: "321765357309",
  appId: "1:321765357309:web:aec710a86daac1af98b094"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function seed() {
  try {
    console.log("Creating demo user...");
    let user;
    try {
      const cred = await createUserWithEmailAndPassword(auth, "demo@brewlytics.app", "BrewDemo@2026");
      user = cred.user;
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        console.log("Demo user already exists. Logging in.");
        const cred = await signInWithEmailAndPassword(auth, "demo@brewlytics.app", "BrewDemo@2026");
        user = cred.user;
      } else {
        throw e;
      }
    }

    console.log("Seeding Firestore docs for user:", user.uid);
    const uid = user.uid;

    await setDoc(doc(db, "users", uid), {
      uid: uid,
      email: "demo@brewlytics.app",
      fullName: "Demo User",
      cafeId: uid,
      plan: "pro",
      createdAt: serverTimestamp()
    });

    await setDoc(doc(db, "cafes", uid), {
      ownerUid: uid,
      name: "Brewlytics Demo Café",
      createdAt: serverTimestamp()
    });

    const datasetId = "dataset-demo-01";
    await setDoc(doc(db, "datasets", datasetId), {
      cafeId: uid,
      uploadedBy: uid,
      fileName: "square_export_q3.csv",
      storagePath: `uploads/${uid}/${datasetId}.csv`,
      status: "ready",
      rowCount: 1840,
      columns: ["Date", "Time", "Item", "Category", "Qty", "Price", "Total"],
      uploadedAt: serverTimestamp()
    });

    await setDoc(doc(db, "metrics", uid), {
      cafeId: uid,
      datasetId: datasetId,
      totalRevenue: 24890,
      totalOrders: 3200,
      averageOrderValue: 7.78,
      revenueByDay: [
        { date: "Oct 1", revenue: 800 },
        { date: "Oct 2", revenue: 850 }
      ],
      topProducts: [
        { name: "Iced Oat Milk Latte", revenue: 12450, units: 1840 },
        { name: "Single Origin Pour-Over", revenue: 8920, units: 1120 }
      ],
      revenueByHour: [
        { hour: 7, revenue: 100 },
        { hour: 8, revenue: 200 }
      ],
      updatedAt: serverTimestamp()
    });

    await setDoc(doc(db, "insights", "insight-01"), {
      cafeId: uid,
      title: "Overstaffing Alert",
      description: "Labor costs exceeded 30% of revenue between 2 PM and 5 PM on Tuesday.",
      category: "timing",
      status: "active",
      createdAt: serverTimestamp()
    });

    const msgId = "msg-01";
    await setDoc(doc(db, "chats", uid, "messages", msgId), {
      role: "assistant",
      text: "Hello! I'm Brewlytics AI. I've analyzed your latest CSV data. Ask me anything about your café's performance.",
      createdAt: serverTimestamp()
    });

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seed();
