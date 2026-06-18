// Mock Database for Online Degree Education Portal

const COURSES_DATA = {
  "mba": {
    name: "Online MBA",
    fullName: "Master of Business Administration",
    level: "Postgraduate",
    duration: "2 Years",
    description: "Equip yourself with leadership and management skills to accelerate your career or launch business ventures.",
    specializations: ["Finance", "Marketing", "Human Resource Management", "Operations", "Information Technology", "Business Analytics"],
    avgSalary: "₹6 LPA - ₹15 LPA",
    eligibility: "Bachelor's degree with minimum 50% marks (45% for reserved categories) from a recognized university."
  },
  "bca": {
    name: "Online BCA",
    fullName: "Bachelor of Computer Applications",
    level: "Undergraduate",
    duration: "3 Years",
    description: "Launch your career in IT, software development, web design, or systems administration with computer applications expertise.",
    specializations: ["Software Engineering", "Data Science", "Cyber Security", "Cloud Computing"],
    avgSalary: "₹3 LPA - ₹7 LPA",
    eligibility: "10+2 passing certificate from a recognized board (Maths background preferred but not mandatory for most universities)."
  },
  "bba": {
    name: "Online BBA",
    fullName: "Bachelor of Business Administration",
    level: "Undergraduate",
    duration: "3 Years",
    description: "Establish a solid foundation in business operations, finance, marketing, and human resource management.",
    specializations: ["Finance & Accounts", "Marketing & Sales", "Human Resource", "Digital Marketing"],
    avgSalary: "₹3.5 LPA - ₹8 LPA",
    eligibility: "10+2 passing certificate from a recognized board in any stream."
  },
  "mca": {
    name: "Online MCA",
    fullName: "Master of Computer Applications",
    level: "Postgraduate",
    duration: "2 Years",
    description: "Deep dive into advanced computer science, application development, cloud database structures, and artificial intelligence.",
    specializations: ["Artificial Intelligence & Machine Learning", "Cyber Security", "Cloud Computing", "Full Stack Development"],
    avgSalary: "₹5 LPA - ₹12 LPA",
    eligibility: "Bachelor's degree in BCA/B.Sc/B.Com/B.A. with Mathematics at 10+2 level or graduation level."
  },
  "mcom": {
    name: "Online M.Com",
    fullName: "Master of Commerce",
    level: "Postgraduate",
    duration: "2 Years",
    description: "Gain advanced academic understanding of economics, finance, accounting, taxation, and business laws.",
    specializations: ["Financial Accounting", "International Business", "Taxation"],
    avgSalary: "₹4 LPA - ₹9 LPA",
    eligibility: "Bachelor's degree in Commerce (B.Com) or related stream from a recognized university."
  }
};

const UNIVERSITIES = [
  {
    id: "manipal",
    name: "Manipal University Online",
    shortName: "Manipal Online",
    logoColor: "linear-gradient(135deg, #FF9900, #FF5500)",
    logoInitials: "MU",
    rating: 4.8,
    reviewsCount: 342,
    naacGrade: "A+",
    approvals: ["UGC-DEB Approved", "AICTE Approved", "WES Accredited", "AACSB Member"],
    lmsRating: 4.9,
    placementRate: 88,
    emiStarts: "₹2,999/month",
    description: "Manipal University Online brings top-tier education with interactive digital learning, expert faculty, and industry-oriented certifications.",
    features: [
      "Free access to 10,000+ Coursera courses",
      "Dedicated career assistance cell with 100+ hiring partners",
      "Live interactive lectures on weekends",
      "Robust e-portfolio creator for student showcase"
    ],
    placementPartners: ["Amazon", "Deloitte", "Capgemini", "Ernst & Young", "Infosys", "KPMG"],
    courses: {
      "mba": { feeTotal: 150000, feeSemester: 37500, duration: "2 Years" },
      "bca": { feeTotal: 120000, feeSemester: 20000, duration: "3 Years" },
      "bba": { feeTotal: 120000, feeSemester: 20000, duration: "3 Years" },
      "mca": { feeTotal: 150000, feeSemester: 37500, duration: "2 Years" },
      "mcom": { feeTotal: 80000, feeSemester: 20000, duration: "2 Years" }
    },
    reviews: [
      { student: "Aditya Sharma", course: "Online MBA", rating: 5, date: "2026-04-12", comment: "The LMS is outstanding. Real-time lectures and recordings are highly detailed. Got placed at Deloitte last week!" },
      { student: "Priya Nair", course: "Online BCA", rating: 4, date: "2026-05-18", comment: "Very comprehensive curriculum. Instructors are supportive, though the exam scheduling portal could be slightly smoother." }
    ]
  },
  {
    id: "amity",
    name: "Amity University Online",
    shortName: "Amity Online",
    logoColor: "linear-gradient(135deg, #00529B, #007EE5)",
    logoInitials: "AU",
    rating: 4.7,
    reviewsCount: 412,
    naacGrade: "A++",
    approvals: ["UGC-DEB Approved", "AICTE Approved", "QS 5-Star Ranked", "WASC Accredited"],
    lmsRating: 4.8,
    placementRate: 86,
    emiStarts: "₹3,500/month",
    description: "Amity Online is India's first university to receive UGC-DEB approval for its online courses, providing global exposure and experienced international faculty.",
    features: [
      "Global faculty from top international universities",
      "Daily live doubt clearing classes",
      "Dedicated 1-on-1 industry mentorship",
      "Robust online portfolio & resume builder"
    ],
    placementPartners: ["Accenture", "HCL", "Google", "Wipro", "TCS", "Cognizant"],
    courses: {
      "mba": { feeTotal: 200000, feeSemester: 50000, duration: "2 Years" },
      "bca": { feeTotal: 150000, feeSemester: 25000, duration: "3 Years" },
      "bba": { feeTotal: 150000, feeSemester: 25000, duration: "3 Years" },
      "mca": { feeTotal: 180000, feeSemester: 45000, duration: "2 Years" },
      "mcom": { feeTotal: 100000, feeSemester: 25000, duration: "2 Years" }
    },
    reviews: [
      { student: "Rahul Verma", course: "Online MBA", rating: 5, date: "2026-03-22", comment: "Outstanding mentorship program. My career coach helped me transition from operations to a marketing lead role." },
      { student: "Karan Mehta", course: "Online MCA", rating: 4, date: "2026-05-02", comment: "Courses are highly focused on modern tech like Cloud and Full Stack. Assignments are challenging but very practical." }
    ]
  },
  {
    id: "chandigarh",
    name: "Chandigarh University Online",
    shortName: "CU Online",
    logoColor: "linear-gradient(135deg, #E31E24, #B30006)",
    logoInitials: "CU",
    rating: 4.5,
    reviewsCount: 289,
    naacGrade: "A+",
    approvals: ["UGC-DEB Approved", "AICTE Approved", "NIRF Top Ranked"],
    lmsRating: 4.5,
    placementRate: 83,
    emiStarts: "₹2,500/month",
    description: "Chandigarh University Online is renowned for its flexible examinations, industry-linked curricula, and highly cost-effective premium degrees.",
    features: [
      "Flexible online examinations (slot booking)",
      "Access to CU's exclusive job portal (CU-Jobs)",
      "Interactive webinars by corporate leaders every week",
      "Comprehensive study material shipped to your home (optional)"
    ],
    placementPartners: ["Microsoft", "Dell", "Capgemini", "Cognizant", "TCS", "Tech Mahindra"],
    courses: {
      "mba": { feeTotal: 120000, feeSemester: 30000, duration: "2 Years" },
      "bca": { feeTotal: 90000, feeSemester: 15000, duration: "3 Years" },
      "bba": { feeTotal: 90000, feeSemester: 15000, duration: "3 Years" },
      "mca": { feeTotal: 100000, feeSemester: 25000, duration: "2 Years" },
      "mcom": { feeTotal: 70000, feeSemester: 17500, duration: "2 Years" }
    },
    reviews: [
      { student: "Simran Kaur", course: "Online BBA", rating: 4, date: "2026-02-15", comment: "Affordable and excellent support system. The exam slot booking is really convenient for working professionals like me." },
      { student: "Amit Patel", course: "Online MCA", rating: 5, date: "2026-04-30", comment: "Best value for money. Syllabus covers Python, Machine Learning, and Cloud Computing basics. Placement team is active." }
    ]
  },
  {
    id: "lpu",
    name: "Lovely Professional University Online",
    shortName: "LPU Online",
    logoColor: "linear-gradient(135deg, #FF6F00, #FFA200)",
    logoInitials: "LPU",
    rating: 4.4,
    reviewsCount: 261,
    naacGrade: "A++",
    approvals: ["UGC-DEB Approved", "AICTE Approved", "WES Approved"],
    lmsRating: 4.6,
    placementRate: 82,
    emiStarts: "₹2,200/month",
    description: "LPU Online provides high-quality academic delivery via its customizable LMS software, live masterclasses, and dedicated relationship manager services.",
    features: [
      "Dedicated mobile application for LMS (Learn on the go)",
      "Guest lectures by international subject experts",
      "100+ hours of live masterclasses and soft skills training",
      "Personalized mentorship with a dedicated relationship manager"
    ],
    placementPartners: ["Amazon", "Flipkart", "Tech Mahindra", "Cognizant", "HDFC Bank", "Paytm"],
    courses: {
      "mba": { feeTotal: 100000, feeSemester: 25000, duration: "2 Years" },
      "bca": { feeTotal: 80000, feeSemester: 13333, duration: "3 Years" },
      "bba": { feeTotal: 80000, feeSemester: 13333, duration: "3 Years" },
      "mca": { feeTotal: 90000, feeSemester: 22500, duration: "2 Years" },
      "mcom": { feeTotal: 60000, feeSemester: 15000, duration: "2 Years" }
    },
    reviews: [
      { student: "Vikram Rathore", course: "Online BCA", rating: 4, date: "2026-01-20", comment: "The LPU Touch mobile app is very convenient. I complete most reading materials during my metro commutes." },
      { student: "Neha Gupta", course: "Online MBA", rating: 5, date: "2026-05-11", comment: "Great curriculum and awesome guest speakers. Placement preparation bootcamps were highly beneficial." }
    ]
  },
  {
    id: "ignou",
    name: "Indira Gandhi National Open University",
    shortName: "IGNOU",
    logoColor: "linear-gradient(135deg, #1B5E20, #4CAF50)",
    logoInitials: "IG",
    rating: 3.9,
    reviewsCount: 890,
    naacGrade: "A++",
    approvals: ["UGC-DEB Approved", "Central Govt University", "AIU Member"],
    lmsRating: 3.2,
    placementRate: 45,
    emiStarts: "N/A",
    description: "IGNOU is the largest open university in the world, backed by the central government of India, offering highly standardized and budget-friendly distance education.",
    features: [
      "Most affordable and low-cost structure in the country",
      "Highly respected self-learning printed materials sent by post",
      "Massive network of local study centers across India",
      "Widest acceptance of degrees in government job examinations"
    ],
    placementPartners: ["Sporadic Job Fairs", "Regional Center Drives", "Axis Bank", "YMCA"],
    courses: {
      "mba": { feeTotal: 62000, feeSemester: 15500, duration: "2 Years" },
      "bca": { feeTotal: 45000, feeSemester: 7500, duration: "3 Years" },
      "bba": { feeTotal: 30000, feeSemester: 5000, duration: "3 Years" },
      "mca": { feeTotal: 56000, feeSemester: 14000, duration: "2 Years" },
      "mcom": { feeTotal: 18000, feeSemester: 4500, duration: "2 Years" }
    },
    reviews: [
      { student: "Harish Kumar", course: "Online M.Com", rating: 4, date: "2026-03-05", comment: "Syllabus is incredibly detailed. Ideal if you are preparing for government exams or CA/CS. However, administrative work takes time." },
      { student: "Ankita Sen", course: "Online BCA", rating: 3, date: "2026-04-18", comment: "Very cost-effective but self-study is required. There are no regular live online sessions. Exams are strict and tough." }
    ]
  },
  {
    id: "sgvu",
    name: "Suresh Gyan Vihar University Online",
    shortName: "SGVU Online",
    logoColor: "linear-gradient(135deg, #4A148C, #8E24AA)",
    logoInitials: "GV",
    rating: 4.1,
    reviewsCount: 120,
    naacGrade: "A",
    approvals: ["UGC-DEB Approved", "AICTE Approved"],
    lmsRating: 4.0,
    placementRate: 70,
    emiStarts: "₹2,000/month",
    description: "SGVU Online offers simplified, career-focused online management and technology courses designed for flexible self-paced learning.",
    features: [
      "Affordable fees with easy EMI structures",
      "Industry-expert designed credit-based learning system",
      "E-Learning resources including videos and ebooks",
      "Quick credit transfer and certificate verification support"
    ],
    placementPartners: ["TCS", "ICICI Bank", "Genpact", "Airtel", "Kotak Mahindra"],
    courses: {
      "mba": { feeTotal: 80000, feeSemester: 20000, duration: "2 Years" },
      "bba": { feeTotal: 60000, feeSemester: 10000, duration: "3 Years" },
      "mca": { feeTotal: 80000, feeSemester: 20000, duration: "2 Years" }
    },
    reviews: [
      { student: "Deepak Joshi", course: "Online MBA", rating: 4, date: "2026-02-28", comment: "Affordable fee and helpful support managers. The platform is simple to use and study materials are up to standard." }
    ]
  }
];
