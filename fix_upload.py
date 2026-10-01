import re

with open('src/pages/CsvUploadDataPreview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add getDoc and useEffect import
content = content.replace(
    'import { useState } from "react";',
    'import { useState, useEffect } from "react";'
)
content = content.replace(
    'import { doc, setDoc, serverTimestamp } from "firebase/firestore";',
    'import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";\nimport { onAuthStateChanged } from "firebase/auth";'
)

state_hook = """  const [isUploading, setIsUploading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
          if (docSnap.exists()) setUserProfile(docSnap.data());
        });
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);"""

content = content.replace(
    '  const [isUploading, setIsUploading] = useState(false);',
    state_hook
)

with open('src/pages/CsvUploadDataPreview.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed CsvUploadDataPreview.")
