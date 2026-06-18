// Mock Database for Online Degree Education Portal

const COURSES_DATA = {
  "mba": {
    name: "Online MBA",
    fullName: "Master of Business Administration",
    level: "Postgraduate",
    duration: "2 Years",
    description: "Equip yourself with leadership and management skills to accelerate your career or launch business ventures.",
    specializations: ["Finance", "Marketing", "Human Resource Management", "Operations", "Information Technology", "Business Analytics"],
    avgSalary: "â‚¹6 LPA - â‚¹15 LPA",
    eligibility: "Bachelor's degree with minimum 50% marks (45% for reserved categories) from a recognized university."
  },
  "bca": {
    name: "Online BCA",
    fullName: "Bachelor of Computer Applications",
    level: "Undergraduate",
    duration: "3 Years",
    description: "Launch your career in IT, software development, web design, or systems administration with computer applications expertise.",
    specializations: ["Software Engineering", "Data Science", "Cyber Security", "Cloud Computing"],
    avgSalary: "â‚¹3 LPA - â‚¹7 LPA",
    eligibility: "10+2 passing certificate from a recognized board (Maths background preferred but not mandatory for most universities)."
  },
  "bba": {
    name: "Online BBA",
    fullName: "Bachelor of Business Administration",
    level: "Undergraduate",
    duration: "3 Years",
    description: "Establish a solid foundation in business operations, finance, marketing, and human resource management.",
    specializations: ["Finance & Accounts", "Marketing & Sales", "Human Resource", "Digital Marketing"],
    avgSalary: "â‚¹3.5 LPA - â‚¹8 LPA",
    eligibility: "10+2 passing certificate from a recognized board in any stream."
  },
  "mca": {
    name: "Online MCA",
    fullName: "Master of Computer Applications",
    level: "Postgraduate",
    duration: "2 Years",
    description: "Deep dive into advanced computer science, application development, cloud database structures, and artificial intelligence.",
    specializations: ["Artificial Intelligence & Machine Learning", "Cyber Security", "Cloud Computing", "Full Stack Development"],
    avgSalary: "â‚¹5 LPA - â‚¹12 LPA",
    eligibility: "Bachelor's degree in BCA/B.Sc/B.Com/B.A. with Mathematics at 10+2 level or graduation level."
  },
  "mcom": {
    name: "Online M.Com",
    fullName: "Master of Commerce",
    level: "Postgraduate",
    duration: "2 Years",
    description: "Gain advanced academic understanding of economics, finance, accounting, taxation, and business laws.",
    specializations: ["Financial Accounting", "International Business", "Taxation"],
    avgSalary: "â‚¹4 LPA - â‚¹9 LPA",
    eligibility: "Bachelor's degree in Commerce (B.Com) or related stream from a recognized university."
  }
};


const UNIVERSITIES = [
    {
        "features":  [
                         "WES Approved for global recognition",
                         "NAAC A+ Accredited",
                         "Placement assistance available",
                         "Live + recorded sessions",
                         "EMI options available"
                     ],
        "rating":  4.6,
        "shortName":  "Amity Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  44775,
                                    "feeTotal":  179100
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  24875,
                                    "feeTotal":  149250
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  49750,
                                    "feeTotal":  199000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  24875,
                                    "feeTotal":  149250
                                }
                    },
        "lmsRating":  4.8,
        "reviews":  [
                        {
                            "date":  "2026-03-19",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Simran Kaur"
                        },
                        {
                            "date":  "2026-04-22",
                            "rating":  4,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Vivek Kapoor"
                        }
                    ],
        "placementPartners":  [
                                  "Amazon",
                                  "HCL",
                                  "Infosys",
                                  "Capgemini",
                                  "ICICI Bank",
                                  "Paytm"
                              ],
        "description":  "Amity University Online is one of India\u0027s most trusted online education platforms, backed by the Amity Group. Globally recognized with WES approval, Amity offers internationally accepted degrees across management, technology, and humanities.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "WES Approved"
                      ],
        "logoInitials":  "AU",
        "emiStarts":  "₹3,109/month",
        "naacGrade":  "A+",
        "reviewsCount":  194,
        "logoColor":  "linear-gradient(135deg, #00529B, #007EE5)",
        "name":  "Amity University Online",
        "id":  "amity_university_online"
    },
    {
        "features":  [
                         "QS World University Ranked",
                         "#1 in Punjab for placements",
                         "Industry mentors from Fortune 500",
                         "100+ specializations available",
                         "Scholarships available"
                     ],
        "rating":  4.6,
        "shortName":  "CU Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  37125,
                                    "feeTotal":  148500
                                },
                        "mcom":  {
                                     "duration":  "2 Years",
                                     "feeSemester":  20625,
                                     "feeTotal":  82500
                                 },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  20625,
                                    "feeTotal":  123750
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  41250,
                                    "feeTotal":  165000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  20625,
                                    "feeTotal":  123750
                                }
                    },
        "lmsRating":  4.8,
        "reviews":  [
                        {
                            "date":  "2026-02-10",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Neha Gupta"
                        },
                        {
                            "date":  "2026-05-15",
                            "rating":  5,
                            "course":  "Online M.Com",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Suresh Kumar"
                        }
                    ],
        "placementPartners":  [
                                  "Capgemini",
                                  "Infosys",
                                  "Accenture",
                                  "Ernst \u0026 Young",
                                  "Microsoft",
                                  "ICICI Bank"
                              ],
        "description":  "Chandigarh University is a QS World-ranked institution offering industry-aligned online programs. Known for strong placement records and a robust alumni network, CU Online bridges academic excellence with real-world outcomes.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "QS Ranked"
                      ],
        "logoInitials":  "CU",
        "emiStarts":  "₹1,719/month",
        "naacGrade":  "A+",
        "reviewsCount":  248,
        "logoColor":  "linear-gradient(135deg, #10B981, #047857)",
        "name":  "Chandigarh University Online",
        "id":  "chandigarh_university_online"
    },
    {
        "features":  [
                         "Highest NAAC A++ grade",
                         "WES approved for Canada/USA",
                         "Strong healthcare + management focus",
                         "Industry-integrated curriculum",
                         "Flexible batch timings"
                     ],
        "rating":  4.8,
        "shortName":  "DY Patil Pune",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  42615,
                                    "feeTotal":  170460
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  23675,
                                    "feeTotal":  142050
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  47350,
                                    "feeTotal":  189400
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  23675,
                                    "feeTotal":  142050
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-03-21",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Vikram Rathore"
                        },
                        {
                            "date":  "2026-03-13",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Rahul Verma"
                        }
                    ],
        "placementPartners":  [
                                  "Infosys",
                                  "Paytm",
                                  "Capgemini",
                                  "TCS",
                                  "Wipro",
                                  "HCL"
                              ],
        "description":  "D.Y. Patil University Pune carries a legacy of over 30 years in education. Its online arm is NAAC A++ accredited — the highest possible grade — making it one of the most credible online education options in India.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved",
                          "WES Approved"
                      ],
        "logoInitials":  "DP",
        "emiStarts":  "₹2,959/month",
        "naacGrade":  "A++",
        "reviewsCount":  197,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "D.Y Patil University - Online (Pune)",
        "id":  "d_y_patil_university_online_pune"
    },
    {
        "features":  [
                         "NAAC A++ + WES Globally recognized",
                         "Bangalore ecosystem advantage",
                         "Startup-friendly environment",
                         "Dedicated career services",
                         "Specializations in Data Science, Marketing, Finance"
                     ],
        "rating":  4.8,
        "shortName":  "Jain Online",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  44100,
                                    "feeTotal":  176400
                                },
                        "mcom":  {
                                     "duration":  "2 Years",
                                     "feeSemester":  24500,
                                     "feeTotal":  98000
                                 },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  24500,
                                    "feeTotal":  147000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  49000,
                                    "feeTotal":  196000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  24500,
                                    "feeTotal":  147000
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-02-14",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Divya Teja"
                        },
                        {
                            "date":  "2026-01-27",
                            "rating":  5,
                            "course":  "Online M.Com",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Simran Kaur"
                        }
                    ],
        "placementPartners":  [
                                  "Tech Mahindra",
                                  "ICICI Bank",
                                  "HCL",
                                  "Wipro",
                                  "Ernst \u0026 Young",
                                  "KPMG"
                              ],
        "description":  "Jain University Online is based in Bangalore, the tech capital of India. NAAC A++ rated with a strong focus on innovation, entrepreneurship, and technology-driven education. Ideal for learners looking for a modern, career-focused degree.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved",
                          "WES Approved"
                      ],
        "logoInitials":  "JU",
        "emiStarts":  "₹2,042/month",
        "naacGrade":  "A++",
        "reviewsCount":  264,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "Jain University Online",
        "id":  "jain_university_online"
    },
    {
        "features":  [
                         "India\u0027s largest university",
                         "Record placements at ₹1Cr+",
                         "AIU member (global recognition)",
                         "Huge alumni network of 2L+",
                         "Internship + placement support"
                     ],
        "rating":  4.8,
        "shortName":  "LPU Online",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  36360,
                                    "feeTotal":  145440
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  20200,
                                    "feeTotal":  121200
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  40400,
                                    "feeTotal":  161600
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  20200,
                                    "feeTotal":  121200
                                }
                    },
        "lmsRating":  4.6,
        "reviews":  [
                        {
                            "date":  "2026-02-18",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Ankita Sen"
                        },
                        {
                            "date":  "2026-02-20",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Rohan Das"
                        }
                    ],
        "placementPartners":  [
                                  "KPMG",
                                  "Paytm",
                                  "HDFC Bank",
                                  "HCL",
                                  "Wipro",
                                  "Infosys"
                              ],
        "description":  "LPU is India\u0027s largest university by enrollment, known for exceptional placement records and strong industry ties. Its online division offers NAAC A++ quality education at a competitive price, accessible from anywhere in India.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved",
                          "AIU Approved"
                      ],
        "logoInitials":  "LPU",
        "emiStarts":  "₹2,525/month",
        "naacGrade":  "A++",
        "reviewsCount":  200,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "Lovely Professional University (LPU) Online",
        "id":  "lovely_professional_university_lpu_online"
    },
    {
        "features":  [
                         "Part of Manipal Education Group",
                         "WES approved (Canada/USA)",
                         "NIRF ranked institute",
                         "Strong industry curriculum",
                         "Flexible weekend batches"
                     ],
        "rating":  4.6,
        "shortName":  "Manipal Jaipur",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  39375,
                                    "feeTotal":  157500
                                },
                        "mcom":  {
                                     "duration":  "2 Years",
                                     "feeSemester":  21875,
                                     "feeTotal":  87500
                                 },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  21875,
                                    "feeTotal":  131250
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  43750,
                                    "feeTotal":  175000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  21875,
                                    "feeTotal":  131250
                                }
                    },
        "lmsRating":  4.7,
        "reviews":  [
                        {
                            "date":  "2026-04-8",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Karan Mehta"
                        },
                        {
                            "date":  "2026-05-5",
                            "rating":  4,
                            "course":  "Online M.Com",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Suresh Kumar"
                        }
                    ],
        "placementPartners":  [
                                  "Accenture",
                                  "HDFC Bank",
                                  "Capgemini",
                                  "Paytm",
                                  "Cognizant",
                                  "Google"
                              ],
        "description":  "Manipal University Jaipur is part of the prestigious Manipal Education Group, one of India\u0027s most respected higher education brands. The online programs carry the same Manipal quality with WES recognition for global learners.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved",
                          "WES Approved"
                      ],
        "logoInitials":  "MJ",
        "emiStarts":  "₹1,823/month",
        "naacGrade":  "A+",
        "reviewsCount":  163,
        "logoColor":  "linear-gradient(135deg, #FF6F00, #FFA200)",
        "name":  "Manipal University Jaipur Online",
        "id":  "manipal_university_jaipur_online"
    },
    {
        "features":  [
                         "AICTE approved \u0026 AIU recognized (MBA equivalent)",
                         "AACSB Business Education Alliance Member",
                         "Top-50 NIRF ranked management institute legacy",
                         "Dual specialization in Marketing, HR, Finance, Analytics",
                         "12 hours of live sessions per course"
                     ],
        "rating":  4.4,
        "shortName":  "Jaipuria PGDM",
        "placementRate":  79,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  35000,
                                    "feeTotal":  140000
                                }
                    },
        "lmsRating":  4.6,
        "reviews":  [
                        {
                            "date":  "2026-03-13",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Simran Kaur"
                        }
                    ],
        "placementPartners":  [
                                  "HCL",
                                  "Cognizant",
                                  "Wipro",
                                  "Accenture",
                                  "Deloitte",
                                  "HDFC Bank"
                              ],
        "description":  "Jaipuria Institute of Management is one of India\u0027s premier management institutes. Its Online PGDM is AICTE-approved and recognized by AIU as equivalent to an MBA. The program is designed for working professionals seeking high-quality management education with flexible weekend live sessions.",
        "approvals":  [
                          "NAAC A Approved",
                          "AICTE Approved",
                          "NBA Approved",
                          "AIU Approved",
                          "AACSB Approved"
                      ],
        "logoInitials":  "JI",
        "emiStarts":  "₹2,917/month",
        "naacGrade":  "A",
        "reviewsCount":  139,
        "logoColor":  "linear-gradient(135deg, #F97316, #C2410C)",
        "name":  "Jaipuria Institute of Management - Online PGDM",
        "id":  "jaipuria_institute_of_management_online_pgdm"
    },
    {
        "features":  [
                         "20+ years in online education",
                         "One of the most affordable NAAC A+ options",
                         "Recognized by UGC-DEB",
                         "Large student community",
                         "Strong for working professionals"
                     ],
        "rating":  4.6,
        "shortName":  "SMU Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  24750,
                                    "feeTotal":  99000
                                },
                        "mcom":  {
                                     "duration":  "2 Years",
                                     "feeSemester":  13750,
                                     "feeTotal":  55000
                                 },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  13750,
                                    "feeTotal":  82500
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  27500,
                                    "feeTotal":  110000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  13750,
                                    "feeTotal":  82500
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-03-28",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Harish Kumar"
                        },
                        {
                            "date":  "2026-02-28",
                            "rating":  4,
                            "course":  "Online M.Com",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Vikram Rathore"
                        }
                    ],
        "placementPartners":  [
                                  "Infosys",
                                  "ICICI Bank",
                                  "Ernst \u0026 Young",
                                  "Tech Mahindra",
                                  "HDFC Bank",
                                  "Wipro"
                              ],
        "description":  "SMU Online (Sikkim Manipal University) is a pioneer in distance/online education in India with 20+ years of experience. Known for affordable fees and solid UGC-DEB accreditation, SMU is a safe and trusted pick for working professionals.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC-DEB Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "SM",
        "emiStarts":  "₹1,146/month",
        "naacGrade":  "A+",
        "reviewsCount":  192,
        "logoColor":  "linear-gradient(135deg, #14B8A6, #0F766E)",
        "name":  "Sikkim Manipal University Online",
        "id":  "sikkim_manipal_university_online"
    },
    {
        "features":  [
                         "Top-5 B-school brand in India",
                         "Strong Mumbai finance industry network",
                         "Premium quality at online pricing",
                         "AICTE + UGC approved",
                         "Finance \u0026 Marketing specializations"
                     ],
        "rating":  4.6,
        "shortName":  "NMIMS Online",
        "placementRate":  84,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  50000,
                                    "feeTotal":  200000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  25000,
                                    "feeTotal":  150000
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-02-3",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Pooja Hegde"
                        },
                        {
                            "date":  "2026-02-23",
                            "rating":  4,
                            "course":  "Online BBA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Vijay Kumar"
                        }
                    ],
        "placementPartners":  [
                                  "Capgemini",
                                  "Infosys",
                                  "Microsoft",
                                  "Accenture",
                                  "Wipro",
                                  "HDFC Bank"
                              ],
        "description":  "NMIMS (Narsee Monjee Institute of Management Studies) is a top-5 private business school brand in India. The online division maintains NMIMS standards with UGC approval, offering strong career outcomes especially in Finance and Marketing.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "NM",
        "emiStarts":  "₹3,125/month",
        "naacGrade":  "A+",
        "reviewsCount":  296,
        "logoColor":  "linear-gradient(135deg, #E31E24, #B30006)",
        "name":  "NMIMS Online",
        "id":  "nmims_online"
    },
    {
        "features":  [
                         "Most affordable NAAC A+ option",
                         "UGC + AICTE approved",
                         "Simple admission process",
                         "EMI options available",
                         "Ideal for working professionals on a budget"
                     ],
        "rating":  4.6,
        "shortName":  "Uttaranchal Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  22050,
                                    "feeTotal":  88200
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12250,
                                    "feeTotal":  73500
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  24500,
                                    "feeTotal":  98000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12250,
                                    "feeTotal":  73500
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-04-13",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Rohan Das"
                        },
                        {
                            "date":  "2026-05-16",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Karan Mehta"
                        }
                    ],
        "placementPartners":  [
                                  "Wipro",
                                  "ICICI Bank",
                                  "TCS",
                                  "HCL",
                                  "Accenture",
                                  "Infosys"
                              ],
        "description":  "Uttaranchal University offers one of the most affordable NAAC A+ online degrees in India. Based in Dehradun, it is a great option for students seeking quality education on a tight budget without compromising on accreditation.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "UU",
        "emiStarts":  "₹1,531/month",
        "naacGrade":  "A+",
        "reviewsCount":  247,
        "logoColor":  "linear-gradient(135deg, #1B5E20, #4CAF50)",
        "name":  "Uttaranchal University Online",
        "id":  "uttaranchal_university_online"
    },
    {
        "features":  [
                         "NAAC A+ certified",
                         "Modern outcome-based curriculum",
                         "Good for Rajasthan-based students",
                         "Industry-aligned programs",
                         "Active student clubs and activities"
                     ],
        "rating":  4.6,
        "shortName":  "VGU Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  33750,
                                    "feeTotal":  135000
                                },
                        "mcom":  {
                                     "duration":  "2 Years",
                                     "feeSemester":  18750,
                                     "feeTotal":  75000
                                 },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  18750,
                                    "feeTotal":  112500
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  37500,
                                    "feeTotal":  150000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  18750,
                                    "feeTotal":  112500
                                }
                    },
        "lmsRating":  4.8,
        "reviews":  [
                        {
                            "date":  "2026-03-12",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Priya Nair"
                        },
                        {
                            "date":  "2026-04-26",
                            "rating":  5,
                            "course":  "Online M.Com",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Deepak Joshi"
                        }
                    ],
        "placementPartners":  [
                                  "HCL",
                                  "Cognizant",
                                  "Accenture",
                                  "Microsoft",
                                  "Google",
                                  "Amazon"
                              ],
        "description":  "VGU (Vivekananda Global University) is a rising name in Jaipur\u0027s education scene. Known for modern curriculum and strong faculty, VGU Online is gaining traction among Rajasthan-based students seeking quality online education.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "VG",
        "emiStarts":  "₹1,562/month",
        "naacGrade":  "A+",
        "reviewsCount":  244,
        "logoColor":  "linear-gradient(135deg, #F97316, #C2410C)",
        "name":  "Vivekananda Global University Online",
        "id":  "vivekananda_global_university_online"
    },
    {
        "features":  [
                         "NAAC A++ at competitive pricing",
                         "Gujarat\u0027s top university brand",
                         "Strong healthcare, engineering, management focus",
                         "Active industry partnerships",
                         "Merit scholarships available"
                     ],
        "rating":  4.8,
        "shortName":  "Parul Online",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  33750,
                                    "feeTotal":  135000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  18750,
                                    "feeTotal":  112500
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  37500,
                                    "feeTotal":  150000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  18750,
                                    "feeTotal":  112500
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-02-2",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Ankita Sen"
                        },
                        {
                            "date":  "2026-05-13",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Vikram Rathore"
                        }
                    ],
        "placementPartners":  [
                                  "ICICI Bank",
                                  "TCS",
                                  "HDFC Bank",
                                  "Cognizant",
                                  "Ernst \u0026 Young",
                                  "HCL"
                              ],
        "description":  "Parul University is one of Gujarat\u0027s largest private universities with NAAC A++ accreditation — a rarity for online providers. Based in Vadodara, it offers excellent value with a strong focus on practical, industry-ready curriculum.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "PU",
        "emiStarts":  "₹2,344/month",
        "naacGrade":  "A++",
        "reviewsCount":  152,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "Parul University Online",
        "id":  "parul_university_online"
    },
    {
        "features":  [
                         "100+ year old institution",
                         "Lowest fees at ₹62,200",
                         "Legacy government university brand",
                         "NIRF ranked",
                         "Ideal for budget-conscious learners"
                     ],
        "rating":  4.4,
        "shortName":  "Andhra Online",
        "placementRate":  79,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  15550,
                                    "feeTotal":  62200
                                },
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  13995,
                                    "feeTotal":  55980
                                }
                    },
        "lmsRating":  4.7,
        "reviews":  [
                        {
                            "date":  "2026-04-1",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Meera Pillai"
                        },
                        {
                            "date":  "2026-02-20",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Suresh Kumar"
                        }
                    ],
        "placementPartners":  [
                                  "Ernst \u0026 Young",
                                  "Accenture",
                                  "Cognizant",
                                  "TCS",
                                  "Infosys",
                                  "HCL"
                              ],
        "description":  "Andhra University is one of India\u0027s oldest and most respected state universities, established in 1926. Their online program is one of the most affordable in the country, ideal for students who need a recognized degree at minimal cost.",
        "approvals":  [
                          "NAAC A Approved",
                          "UGC Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "AU",
        "emiStarts":  "₹1,166/month",
        "naacGrade":  "A",
        "reviewsCount":  215,
        "logoColor":  "linear-gradient(135deg, #1B5E20, #4CAF50)",
        "name":  "Andhra University Online",
        "id":  "andhra_university_online"
    },
    {
        "features":  [
                         "Research-driven institution",
                         "Strong pharma + management programs",
                         "Nature campus vibes",
                         "Accredited by NAAC and NIRF",
                         "Flexible batch options"
                     ],
        "rating":  4.4,
        "shortName":  "Shoolini Online",
        "placementRate":  79,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  27500,
                                    "feeTotal":  110000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  13750,
                                    "feeTotal":  82500
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-02-2",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Karan Mehta"
                        },
                        {
                            "date":  "2026-04-20",
                            "rating":  5,
                            "course":  "Online BBA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Arjun Reddy"
                        }
                    ],
        "placementPartners":  [
                                  "Amazon",
                                  "Ernst \u0026 Young",
                                  "Google",
                                  "Wipro",
                                  "HDFC Bank",
                                  "Paytm"
                              ],
        "description":  "Shoolini University is a private university nestled in Himachal Pradesh, known for research excellence and strong industry connections. The online arm brings this quality to learners across India at a reasonable fee.",
        "approvals":  [
                          "NAAC A Approved",
                          "UGC Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "SU",
        "emiStarts":  "₹1,719/month",
        "naacGrade":  "A",
        "reviewsCount":  173,
        "logoColor":  "linear-gradient(135deg, #00529B, #007EE5)",
        "name":  "Shoolini University Online",
        "id":  "shoolini_university_online"
    },
    {
        "features":  [
                         "NAAC A++ university",
                         "Strong South India alumni network",
                         "Excellent tech + management programs",
                         "AICTE + NIRF recognized",
                         "Affordable at ₹1L for NAAC A++"
                     ],
        "rating":  4.8,
        "shortName":  "SRM Online",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  22500,
                                    "feeTotal":  90000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12500,
                                    "feeTotal":  75000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  25000,
                                    "feeTotal":  100000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12500,
                                    "feeTotal":  75000
                                }
                    },
        "lmsRating":  4.7,
        "reviews":  [
                        {
                            "date":  "2026-01-18",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Arjun Reddy"
                        },
                        {
                            "date":  "2026-04-2",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Swati Mishra"
                        }
                    ],
        "placementPartners":  [
                                  "ICICI Bank",
                                  "Amazon",
                                  "Deloitte",
                                  "HDFC Bank",
                                  "KPMG",
                                  "Accenture"
                              ],
        "description":  "SRM University is one of South India\u0027s most prominent private universities. NAAC A++ rated, SRM Online delivers strong management and technology programs with excellent placement support and a massive South Indian alumni network.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "SRM",
        "emiStarts":  "₹1,562/month",
        "naacGrade":  "A++",
        "reviewsCount":  133,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "SRM University Online",
        "id":  "srm_university_online"
    },
    {
        "features":  [
                         "Delhi NCR location advantage",
                         "NAAC A+ at just ₹90,000",
                         "Strong industry tie-ups in NCR",
                         "AICTE approved",
                         "Great for Delhi NCR-based students"
                     ],
        "rating":  4.6,
        "shortName":  "Galgotias Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  20250,
                                    "feeTotal":  81000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  11250,
                                    "feeTotal":  67500
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  22500,
                                    "feeTotal":  90000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  11250,
                                    "feeTotal":  67500
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-03-11",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Suresh Kumar"
                        },
                        {
                            "date":  "2026-05-9",
                            "rating":  4,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Karan Mehta"
                        }
                    ],
        "placementPartners":  [
                                  "Amazon",
                                  "TCS",
                                  "Infosys",
                                  "Wipro",
                                  "Capgemini",
                                  "HDFC Bank"
                              ],
        "description":  "Galgotias University in Greater Noida is perfectly positioned in the Delhi NCR corridor. NAAC A+ rated, it offers affordable online programs with strong industry exposure from India\u0027s electronics and IT manufacturing hub.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "GU",
        "emiStarts":  "₹1,406/month",
        "naacGrade":  "A+",
        "reviewsCount":  225,
        "logoColor":  "linear-gradient(135deg, #1B5E20, #4CAF50)",
        "name":  "Galgotias University Online",
        "id":  "galgotias_university_online"
    },
    {
        "features":  [
                         "Strong technical education heritage",
                         "NAAC A+ + NIRF ranked",
                         "AICTE + UGC approved",
                         "Good for South India-based learners",
                         "Industry mentorship programs"
                     ],
        "rating":  4.6,
        "shortName":  "Vignan Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  22500,
                                    "feeTotal":  90000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12500,
                                    "feeTotal":  75000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  25000,
                                    "feeTotal":  100000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12500,
                                    "feeTotal":  75000
                                }
                    },
        "lmsRating":  4.7,
        "reviews":  [
                        {
                            "date":  "2026-03-6",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Karan Mehta"
                        },
                        {
                            "date":  "2026-01-20",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Simran Kaur"
                        }
                    ],
        "placementPartners":  [
                                  "Tech Mahindra",
                                  "Accenture",
                                  "HDFC Bank",
                                  "Paytm",
                                  "Google",
                                  "ICICI Bank"
                              ],
        "description":  "Vignan University is a prominent institution in Andhra Pradesh known for technical and management education. The online division carries NAAC A+ credibility with NIRF ranking recognition, offering quality programs at very fair pricing.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "VU",
        "emiStarts":  "₹1,562/month",
        "naacGrade":  "A+",
        "reviewsCount":  228,
        "logoColor":  "linear-gradient(135deg, #14B8A6, #0F766E)",
        "name":  "Vignan University Online",
        "id":  "vignan_university_online"
    },
    {
        "features":  [
                         "Most affordable at ₹80,000",
                         "UGC + AICTE approved",
                         "Good for Central India learners",
                         "Fast admission process",
                         "Easy EMI options"
                     ],
        "rating":  4.1,
        "shortName":  "Kalinga Online",
        "placementRate":  68,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  18000,
                                    "feeTotal":  72000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  10000,
                                    "feeTotal":  60000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  20000,
                                    "feeTotal":  80000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  10000,
                                    "feeTotal":  60000
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-02-15",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Amit Patel"
                        },
                        {
                            "date":  "2026-04-21",
                            "rating":  4,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Suresh Kumar"
                        }
                    ],
        "placementPartners":  [
                                  "Tech Mahindra",
                                  "Paytm",
                                  "TCS",
                                  "Amazon",
                                  "Microsoft",
                                  "HCL"
                              ],
        "description":  "Kalinga University in Raipur offers online programs at some of the most budget-friendly rates in Central India. While NAAC B+, it holds full UGC and AICTE approval, making it a solid choice for students seeking genuine but affordable online education.",
        "approvals":  [
                          "NAAC B+ Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "KU",
        "emiStarts":  "₹1,250/month",
        "naacGrade":  "B+",
        "reviewsCount":  167,
        "logoColor":  "linear-gradient(135deg, #FF6F00, #FFA200)",
        "name":  "Kalinga University Online",
        "id":  "kalinga_university_online"
    },
    {
        "features":  [
                         "Punjab\u0027s top private university",
                         "Strong research focus",
                         "Industry 4.0 aligned curriculum",
                         "NAAC A+ + NIRF recognized",
                         "Premium learning experience"
                     ],
        "rating":  4.6,
        "shortName":  "Chitkara Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  45000,
                                    "feeTotal":  180000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  25000,
                                    "feeTotal":  150000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  50000,
                                    "feeTotal":  200000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  25000,
                                    "feeTotal":  150000
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-02-18",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Amit Patel"
                        },
                        {
                            "date":  "2026-02-9",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Neha Gupta"
                        }
                    ],
        "placementPartners":  [
                                  "Microsoft",
                                  "HDFC Bank",
                                  "Deloitte",
                                  "HCL",
                                  "Cognizant",
                                  "Tech Mahindra"
                              ],
        "description":  "Chitkara University is Punjab\u0027s leading private university with a strong focus on innovation and technology-driven education. The online programs are well-structured with strong industry collaborations and placement support.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "CU",
        "emiStarts":  "₹3,125/month",
        "naacGrade":  "A+",
        "reviewsCount":  213,
        "logoColor":  "linear-gradient(135deg, #E31E24, #B30006)",
        "name":  "Chitkara University Online",
        "id":  "chitkara_university_online"
    },
    {
        "features":  [
                         "Only Indian private university with AACSB",
                         "QS World Rankings recognized",
                         "Global faculty from top universities",
                         "Excellent for international careers",
                         "Premium brand for MBAs"
                     ],
        "rating":  4.4,
        "shortName":  "OP Jindal Online",
        "placementRate":  79,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  45000,
                                    "feeTotal":  180000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  22500,
                                    "feeTotal":  135000
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-05-19",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Divya Teja"
                        },
                        {
                            "date":  "2026-01-11",
                            "rating":  5,
                            "course":  "Online BBA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Meera Pillai"
                        }
                    ],
        "placementPartners":  [
                                  "Amazon",
                                  "TCS",
                                  "Cognizant",
                                  "Ernst \u0026 Young",
                                  "HCL",
                                  "ICICI Bank"
                              ],
        "description":  "OP Jindal Global University is India\u0027s only private university ranked in QS World Rankings with AACSB accreditation — the gold standard for business schools globally. Ideal for students with global career ambitions.",
        "approvals":  [
                          "NAAC A Approved",
                          "UGC Approved",
                          "AACSB Approved",
                          "QS Ranked"
                      ],
        "logoInitials":  "OJG",
        "emiStarts":  "₹2,812/month",
        "naacGrade":  "A",
        "reviewsCount":  191,
        "logoColor":  "linear-gradient(135deg, #1A237E, #3F51B5)",
        "name":  "OP Jindal Global University Online",
        "id":  "op_jindal_global_university_online"
    },
    {
        "features":  [
                         "Delhi-based prestigious institution",
                         "Strong management + pharma legacy",
                         "NAAC A rated",
                         "Excellent value for Delhi NCR students",
                         "UGC + AICTE approved"
                     ],
        "rating":  4.4,
        "shortName":  "Jamia Hamdard",
        "placementRate":  79,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  23288,
                                    "feeTotal":  93150
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12938,
                                    "feeTotal":  77625
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  25875,
                                    "feeTotal":  103500
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12938,
                                    "feeTotal":  77625
                                }
                    },
        "lmsRating":  4.3,
        "reviews":  [
                        {
                            "date":  "2026-05-18",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Neha Gupta"
                        },
                        {
                            "date":  "2026-02-3",
                            "rating":  4,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Meera Pillai"
                        }
                    ],
        "placementPartners":  [
                                  "Amazon",
                                  "Infosys",
                                  "ICICI Bank",
                                  "Google",
                                  "Wipro",
                                  "Capgemini"
                              ],
        "description":  "Jamia Hamdard is one of Delhi\u0027s most respected institutions with a strong Unani, pharmacy, and management legacy. The online programs carry the Jamia Hamdard brand value and are ideal for Delhi NCR-based learners.",
        "approvals":  [
                          "NAAC A Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "JH",
        "emiStarts":  "₹1,617/month",
        "naacGrade":  "A",
        "reviewsCount":  140,
        "logoColor":  "linear-gradient(135deg, #00529B, #007EE5)",
        "name":  "Jamia Hamdard University Online",
        "id":  "jamia_hamdard_university_online"
    },
    {
        "features":  [
                         "Strong NCR presence",
                         "Faridabad\u0027s top university",
                         "UGC-DEB + AICTE + NAAC A",
                         "Good for Delhi-Haryana students",
                         "Active industry collaborations"
                     ],
        "rating":  4.4,
        "shortName":  "Manav Rachna",
        "placementRate":  79,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  28800,
                                    "feeTotal":  115200
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  16000,
                                    "feeTotal":  96000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  32000,
                                    "feeTotal":  128000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  16000,
                                    "feeTotal":  96000
                                }
                    },
        "lmsRating":  4.6,
        "reviews":  [
                        {
                            "date":  "2026-03-17",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Pooja Hegde"
                        },
                        {
                            "date":  "2026-04-4",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Neha Gupta"
                        }
                    ],
        "placementPartners":  [
                                  "Capgemini",
                                  "Microsoft",
                                  "HCL",
                                  "Deloitte",
                                  "Paytm",
                                  "Infosys"
                              ],
        "description":  "Manav Rachna University in Faridabad is a well-established NCR institution known for strong management and engineering programs. The online arm is UGC-DEB recognized, serving both fresh graduates and working professionals.",
        "approvals":  [
                          "NAAC A Approved",
                          "UGC-DEB Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "MR",
        "emiStarts":  "₹2,000/month",
        "naacGrade":  "A",
        "reviewsCount":  135,
        "logoColor":  "linear-gradient(135deg, #10B981, #047857)",
        "name":  "Manav Rachna University Online",
        "id":  "manav_rachna_university_online"
    },
    {
        "features":  [
                         "NAAC A+ at just ₹90,000",
                         "Rajasthan\u0027s hidden gem",
                         "UGC + AICTE approved",
                         "Flexible learning options",
                         "Great for women professionals"
                     ],
        "rating":  4.6,
        "shortName":  "Mody Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  20250,
                                    "feeTotal":  81000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  11250,
                                    "feeTotal":  67500
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  22500,
                                    "feeTotal":  90000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  11250,
                                    "feeTotal":  67500
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-03-23",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Vivek Kapoor"
                        },
                        {
                            "date":  "2026-03-9",
                            "rating":  4,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Meera Pillai"
                        }
                    ],
        "placementPartners":  [
                                  "Deloitte",
                                  "Microsoft",
                                  "HCL",
                                  "TCS",
                                  "Google",
                                  "Cognizant"
                              ],
        "description":  "Mody University is a unique women-first (co-ed online) university in Rajasthan with NAAC A+ accreditation. One of the best value propositions in online education — NAAC A+ quality at just ₹90,000.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "MU",
        "emiStarts":  "₹1,406/month",
        "naacGrade":  "A+",
        "reviewsCount":  182,
        "logoColor":  "linear-gradient(135deg, #1B5E20, #4CAF50)",
        "name":  "Mody University Online",
        "id":  "mody_university_online"
    },
    {
        "features":  [
                         "NAAC A++ at just ₹1 Lakh",
                         "ISO certified processes",
                         "UGC approved",
                         "Great for Punjab-based learners",
                         "Underrated but highly credible"
                     ],
        "rating":  4.8,
        "shortName":  "Guru Kashi",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  22500,
                                    "feeTotal":  90000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12500,
                                    "feeTotal":  75000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  25000,
                                    "feeTotal":  100000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12500,
                                    "feeTotal":  75000
                                }
                    },
        "lmsRating":  4.9,
        "reviews":  [
                        {
                            "date":  "2026-03-23",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Neha Gupta"
                        },
                        {
                            "date":  "2026-02-9",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Rahul Verma"
                        }
                    ],
        "placementPartners":  [
                                  "Infosys",
                                  "Paytm",
                                  "Capgemini",
                                  "Google",
                                  "HDFC Bank",
                                  "Ernst \u0026 Young"
                              ],
        "description":  "Guru Kashi University in Bathinda is Punjab\u0027s standout NAAC A++ institution offering online degrees at just ₹1 Lakh. ISO-certified processes and UGC approval make this one of the most underrated but credible options in online education.",
        "approvals":  [
                          "NAAC A++ Approved"
                      ],
        "logoInitials":  "GK",
        "emiStarts":  "₹1,562/month",
        "naacGrade":  "A++",
        "reviewsCount":  210,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "Guru Kashi University Online",
        "id":  "guru_kashi_university_online"
    },
    {
        "features":  [
                         "NAAC A++ prestigious institution",
                         "NIRF ranked nationally",
                         "Strong Tamil Nadu industry connect",
                         "Premium academic standards",
                         "Excellent for M.Com and MBA"
                     ],
        "rating":  4.8,
        "shortName":  "SASTRA Online",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  49500,
                                    "feeTotal":  198000
                                },
                        "mcom":  {
                                     "duration":  "2 Years",
                                     "feeSemester":  27500,
                                     "feeTotal":  110000
                                 },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  55000,
                                    "feeTotal":  220000
                                }
                    },
        "lmsRating":  4.6,
        "reviews":  [
                        {
                            "date":  "2026-02-9",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Neha Gupta"
                        },
                        {
                            "date":  "2026-02-27",
                            "rating":  4,
                            "course":  "Online M.Com",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Rohan Das"
                        }
                    ],
        "placementPartners":  [
                                  "Accenture",
                                  "Capgemini",
                                  "Wipro",
                                  "Cognizant",
                                  "Amazon",
                                  "Tech Mahindra"
                              ],
        "description":  "SASTRA University is a highly respected institution in Tamil Nadu with NAAC A++ rating. Known for engineering and management excellence, SASTRA Online offers premium education with strong placement outcomes and NIRF recognition.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC-DEB Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "SA",
        "emiStarts":  "₹2,292/month",
        "naacGrade":  "A++",
        "reviewsCount":  250,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "SASTRA University Online",
        "id":  "sastra_university_online"
    },
    {
        "features":  [
                         "70+ year old institution",
                         "Haryana\u0027s top government university",
                         "NAAC A+ accredited",
                         "Under ₹1 Lakh fees",
                         "Excellent for Haryana-based learners"
                     ],
        "rating":  4.6,
        "shortName":  "Kurukshetra Online",
        "placementRate":  84,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  22172,
                                    "feeTotal":  88690
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12318,
                                    "feeTotal":  73909
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  24636,
                                    "feeTotal":  98545
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  12318,
                                    "feeTotal":  73909
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-04-11",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Deepak Joshi"
                        },
                        {
                            "date":  "2026-04-5",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Divya Teja"
                        }
                    ],
        "placementPartners":  [
                                  "KPMG",
                                  "Cognizant",
                                  "Amazon",
                                  "Paytm",
                                  "Infosys",
                                  "ICICI Bank"
                              ],
        "description":  "Kurukshetra University is one of Haryana\u0027s oldest and most respected state universities, established in 1956. The online programs carry decades of academic credibility and NAAC A+ recognition at a near-budget price point.",
        "approvals":  [
                          "NAAC A+ Approved",
                          "UGC Approved",
                          "AICTE Approved"
                      ],
        "logoInitials":  "K",
        "emiStarts":  "₹1,540/month",
        "naacGrade":  "A+",
        "reviewsCount":  218,
        "logoColor":  "linear-gradient(135deg, #14B8A6, #0F766E)",
        "name":  "Kurukshetra University Online",
        "id":  "kurukshetra_university_online"
    },
    {
        "features":  [
                         "Unique energy/logistics MBA niche",
                         "NIRF ranked",
                         "Strong industry-academia programs",
                         "Good for oil, gas, supply chain professionals",
                         "AICTE + UGC-DEB approved"
                     ],
        "rating":  4.4,
        "shortName":  "UPES Online",
        "placementRate":  79,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  40500,
                                    "feeTotal":  162000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  22500,
                                    "feeTotal":  135000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  45000,
                                    "feeTotal":  180000
                                }
                    },
        "lmsRating":  4.8,
        "reviews":  [
                        {
                            "date":  "2026-05-6",
                            "rating":  4,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Ankita Sen"
                        },
                        {
                            "date":  "2026-02-26",
                            "rating":  4,
                            "course":  "Online BBA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Swati Mishra"
                        }
                    ],
        "placementPartners":  [
                                  "Deloitte",
                                  "Infosys",
                                  "ICICI Bank",
                                  "TCS",
                                  "Google",
                                  "Cognizant"
                              ],
        "description":  "UPES (University of Petroleum and Energy Studies) is a niche institution renowned for its specializations in energy, logistics, and sustainability management. The online programs appeal to professionals in core industry sectors seeking niche MBA/management credentials.",
        "approvals":  [
                          "NAAC A Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Approved"
                      ],
        "logoInitials":  "UP",
        "emiStarts":  "₹2,812/month",
        "naacGrade":  "A",
        "reviewsCount":  313,
        "logoColor":  "linear-gradient(135deg, #F97316, #C2410C)",
        "name":  "UPES Online",
        "id":  "upes_online"
    },
    {
        "features":  [
                         "AICTE approved postgraduate programs",
                         "Over 2 decades of distance learning excellence",
                         "Robust placement assistance (3000+ offers)",
                         "ISO 9001:2015 Certified institution",
                         "Advanced e-learning resources"
                     ],
        "rating":  4.8,
        "shortName":  "SCDL Pune",
        "placementRate":  88,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  18500,
                                    "feeTotal":  74000
                                }
                    },
        "lmsRating":  4.6,
        "reviews":  [
                        {
                            "date":  "2026-01-21",
                            "rating":  5,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Simran Kaur"
                        }
                    ],
        "placementPartners":  [
                                  "Accenture",
                                  "Google",
                                  "Cognizant",
                                  "Capgemini",
                                  "Ernst \u0026 Young",
                                  "TCS"
                              ],
        "description":  "SCDL is a premier distance learning institution in India, offering industry-relevant postgraduate programs designed for working professionals. A pioneer since 2001, it provides a student-centric digital ecosystem with robust placement assistance.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "ISO Approved"
                      ],
        "logoInitials":  "SCDL",
        "emiStarts":  "₹1,542/month",
        "naacGrade":  "A++",
        "reviewsCount":  132,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "Symbiosis Centre for Distance Learning (SCDL)",
        "id":  "symbiosis_centre_for_distance_learning_scdl"
    },
    {
        "features":  [
                         "NIRF Rank 7 (University Category)",
                         "Highest NAAC A++ accreditation",
                         "AI-integrated interactive learning platform",
                         "Mentorship from world-class PhD faculty",
                         "Values-based holistic education model"
                     ],
        "rating":  4.8,
        "shortName":  "Amrita Online",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  38250,
                                    "feeTotal":  153000
                                },
                        "mcom":  {
                                     "duration":  "2 Years",
                                     "feeSemester":  21250,
                                     "feeTotal":  85000
                                 },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  21250,
                                    "feeTotal":  127500
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  42500,
                                    "feeTotal":  170000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  21250,
                                    "feeTotal":  127500
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-01-1",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Swati Mishra"
                        },
                        {
                            "date":  "2026-03-20",
                            "rating":  5,
                            "course":  "Online M.Com",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Neha Gupta"
                        }
                    ],
        "placementPartners":  [
                                  "Paytm",
                                  "Tech Mahindra",
                                  "Capgemini",
                                  "TCS",
                                  "Accenture",
                                  "Google"
                              ],
        "description":  "Amrita Vishwa Vidyapeetham is a top-ranked private research university bringing world-class academic excellence to the digital space. Programs feature mentorship from distinguished PhD faculty and an AI-integrated interactive learning platform.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Top 10 Approved"
                      ],
        "logoInitials":  "AV",
        "emiStarts":  "₹1,771/month",
        "naacGrade":  "A++",
        "reviewsCount":  160,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "Amrita Vishwa Vidyapeetham Online",
        "id":  "amrita_vishwa_vidyapeetham_online"
    },
    {
        "features":  [
                         "UGC Category-I University status",
                         "AICTE approved MBA \u0026 MCA",
                         "Project-based learning approach",
                         "Strong research \u0026 innovation ecosystem",
                         "Consistent track record of MNC placements"
                     ],
        "rating":  4.8,
        "shortName":  "KL Online",
        "placementRate":  88,
        "courses":  {
                        "mca":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  27000,
                                    "feeTotal":  108000
                                },
                        "bca":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  15000,
                                    "feeTotal":  90000
                                },
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  30000,
                                    "feeTotal":  120000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  15000,
                                    "feeTotal":  90000
                                }
                    },
        "lmsRating":  4.4,
        "reviews":  [
                        {
                            "date":  "2026-05-22",
                            "rating":  5,
                            "course":  "Online MCA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Pooja Hegde"
                        },
                        {
                            "date":  "2026-04-22",
                            "rating":  5,
                            "course":  "Online BCA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Neha Gupta"
                        }
                    ],
        "placementPartners":  [
                                  "ICICI Bank",
                                  "Infosys",
                                  "Deloitte",
                                  "KPMG",
                                  "Capgemini",
                                  "Microsoft"
                              ],
        "description":  "KL University (Deemed to be University) is globally recognized for academic rigor and innovation. Online programs emphasize research-driven curriculum and project-based learning to prepare students for the global workforce.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Top 50 Approved"
                      ],
        "logoInitials":  "KL",
        "emiStarts":  "₹1,875/month",
        "naacGrade":  "A++",
        "reviewsCount":  257,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "KL University Online",
        "id":  "kl_university_online"
    },
    {
        "features":  [
                         "NAAC A++ Grade (Highest)",
                         "AICTE approved management programs",
                         "WES approved for global immigration",
                         "Top-50 NIRF ranked university legacy",
                         "Advanced virtual learning environment"
                     ],
        "rating":  4.8,
        "shortName":  "DY Patil Mumbai",
        "placementRate":  88,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  35000,
                                    "feeTotal":  140000
                                },
                        "bba":  {
                                    "duration":  "3 Years",
                                    "feeSemester":  17500,
                                    "feeTotal":  105000
                                }
                    },
        "lmsRating":  4.6,
        "reviews":  [
                        {
                            "date":  "2026-02-19",
                            "rating":  5,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Ankita Sen"
                        },
                        {
                            "date":  "2026-04-17",
                            "rating":  4,
                            "course":  "Online BBA",
                            "comment":  "Great study materials and excellent coordinators support. Highly budget-friendly and fully valid UGC approved degrees. Placement support is actively helping us prepare.",
                            "student":  "Amit Patel"
                        }
                    ],
        "placementPartners":  [
                                  "Paytm",
                                  "Amazon",
                                  "ICICI Bank",
                                  "Infosys",
                                  "Deloitte",
                                  "HDFC Bank"
                              ],
        "description":  "D.Y. Patil University, Navi Mumbai, is dedicated to professional excellence through industry-relevant programs. The online division offers flexible degrees with worldwide recognition, facilitating both career growth and global immigration.",
        "approvals":  [
                          "NAAC A++ Approved",
                          "UGC Approved",
                          "AICTE Approved",
                          "NIRF Rank 44 Approved"
                      ],
        "logoInitials":  "DP",
        "emiStarts":  "₹2,188/month",
        "naacGrade":  "A++",
        "reviewsCount":  304,
        "logoColor":  "linear-gradient(135deg, #4A148C, #8E24AA)",
        "name":  "DY Patil Vidyapeeth Online (Navi Mumbai)",
        "id":  "dy_patil_vidyapeeth_online_navi_mumbai"
    },
    {
        "features":  [
                         "AACSB Accredited business school",
                         "Taught by Silicon Valley professionals",
                         "WES approved for global recognition",
                         "AIU Equivalence for Indian learners",
                         "Heritage of 100+ years in education"
                     ],
        "rating":  4.6,
        "shortName":  "Golden Gate",
        "placementRate":  84,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  75000,
                                    "feeTotal":  300000
                                }
                    },
        "lmsRating":  4.6,
        "reviews":  [
                        {
                            "date":  "2026-03-27",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Meera Pillai"
                        }
                    ],
        "placementPartners":  [
                                  "Cognizant",
                                  "Infosys",
                                  "HCL",
                                  "ICICI Bank",
                                  "KPMG",
                                  "Deloitte"
                              ],
        "description":  "Located in the heart of San Francisco, Golden Gate University (GGU) has been a leader in professional education for over 100 years. Its online international programs offer Silicon Valley insights and global exposure for ambitious professionals.",
        "approvals":  [
                          "AACSB Approved",
                          "WSCUC Approved",
                          "WES Approved"
                      ],
        "logoInitials":  "GG",
        "emiStarts":  "₹6,250/month",
        "naacGrade":  "A+",
        "reviewsCount":  132,
        "logoColor":  "linear-gradient(135deg, #1A237E, #3F51B5)",
        "name":  "Golden Gate University (USA)",
        "id":  "golden_gate_university_usa"
    },
    {
        "features":  [
                         "Top-tier UK public research university",
                         "Triple Crown accredited curriculum",
                         "WES recognized British degree",
                         "Global alumni network of 200,000+",
                         "Comprehensive career support services"
                     ],
        "rating":  4.6,
        "shortName":  "Liverpool John Moores",
        "placementRate":  84,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  62500,
                                    "feeTotal":  250000
                                }
                    },
        "lmsRating":  4.5,
        "reviews":  [
                        {
                            "date":  "2026-03-13",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Arjun Reddy"
                        }
                    ],
        "placementPartners":  [
                                  "Tech Mahindra",
                                  "Deloitte",
                                  "Accenture",
                                  "Wipro",
                                  "Microsoft",
                                  "Cognizant"
                              ],
        "description":  "Liverpool John Moores University (LJMU) is a highly ranked public research university in the UK with a heritage dating back to 1823. Its online international programs provide access to a prestigious British degree through a collaborative global platform.",
        "approvals":  [
                          "Privy Council Approved",
                          "AACSB Approved",
                          "WES Approved"
                      ],
        "logoInitials":  "LJ",
        "emiStarts":  "₹5,208/month",
        "naacGrade":  "A+",
        "reviewsCount":  164,
        "logoColor":  "linear-gradient(135deg, #1A237E, #3F51B5)",
        "name":  "Liverpool John Moores University (UK)",
        "id":  "liverpool_john_moores_university_uk"
    },
    {
        "features":  [
                         "Licensed by Florida CIE",
                         "Most affordable US Online degree",
                         "100% online flexible structure",
                         "Industry-centric curriculum",
                         "Modern technological integration"
                     ],
        "rating":  4.4,
        "shortName":  "Birchwood",
        "placementRate":  79,
        "courses":  {
                        "mba":  {
                                    "duration":  "2 Years",
                                    "feeSemester":  16375,
                                    "feeTotal":  65500
                                }
                    },
        "lmsRating":  4.9,
        "reviews":  [
                        {
                            "date":  "2026-03-4",
                            "rating":  4,
                            "course":  "Online MBA",
                            "comment":  "Pursuing my degree here has been standard and smooth. The LMS is polished and the live weekend classes are very helpful. The exams are conducted online and schedules are flexible.",
                            "student":  "Vikram Rathore"
                        }
                    ],
        "placementPartners":  [
                                  "Tech Mahindra",
                                  "Accenture",
                                  "Google",
                                  "HDFC Bank",
                                  "ICICI Bank",
                                  "Microsoft"
                              ],
        "description":  "Birchwood University is an innovative Florida-based institution committed to affordable and industry-aligned higher education. Programs are tailored to modern market demands, focusing on technological integration and managerial leadership.",
        "approvals":  [
                          "Florida CIE Approved",
                          "CECU Approved",
                          "QAHE Approved"
                      ],
        "logoInitials":  "BW",
        "emiStarts":  "₹1,365/month",
        "naacGrade":  "A",
        "reviewsCount":  294,
        "logoColor":  "linear-gradient(135deg, #00529B, #007EE5)",
        "name":  "Birchwood University (USA)",
        "id":  "birchwood_university_usa"
    }
];