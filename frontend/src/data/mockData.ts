import type { Complaint, User } from "../types";

// ============================================================
// MOCK USERS
// TODO: Replace with Firebase Auth user data
// ============================================================
export const MOCK_USERS: User[] = [
  {
    id: "u001",
    name: "Rahul Sharma",
    email: "rahul.sharma@university.edu",
    role: "student",
    department: "Computer Science",
  },
  {
    id: "u002",
    name: "Dr. Priya Singh",
    email: "priya.singh@university.edu",
    role: "faculty",
    department: "Electronics Engineering",
  },
  {
    id: "u003",
    name: "Arjun Mehta",
    email: "arjun.mehta@university.edu",
    role: "staff",
    department: "Facilities Management",
  },
  {
    id: "u004",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    department: "Administration",
  },
];

// ============================================================
// MOCK COMPLAINTS
// TODO: Replace with Firestore getDocs(query(collection(db, 'complaints'), ...))
// TODO: For real-time updates: onSnapshot(collection(db, 'complaints'), callback)
// ============================================================
export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "CMP-001",
    title: "Broken Water Cooler in Block A Corridor",
    category: "Infrastructure",
    location: "Block A, Ground Floor Corridor",
    priority: "High",
    description:
      "The water cooler near the main staircase in Block A has been non-functional for over a week. Students and staff are unable to get drinking water, especially during peak afternoon hours. The cooler makes a rattling noise and leaks water onto the floor, creating a safety hazard.",
    status: "in_progress",
    submittedBy: "Rahul Sharma",
    submittedByRole: "student",
    submittedById: "u001",
    date: "2026-02-28",
    department: "Facilities Management",
    aiPlan: {
      step1:
        "Assign a maintenance technician from the Facilities team to inspect the water cooler unit within 4 hours and document the fault.",
      step2:
        "Procure required spare parts (compressor/motor) from the central store or local vendor within 24 hours and carry out repair work.",
      step3:
        "Test repaired unit for proper cooling function and leak-free operation, then close the ticket after confirming with the submitter.",
      generatedAt: "2026-03-01",
    },
    comments: [
      {
        id: "c1",
        author: "Admin User",
        role: "admin",
        text: "Assigned to maintenance team. Estimated resolution within 48 hours.",
        date: "2026-03-01",
      },
    ],
  },
  {
    id: "CMP-002",
    title: "WiFi Dead Zone in Library Reading Hall",
    category: "IT",
    location: "Central Library, 2nd Floor Reading Hall",
    priority: "Critical",
    description:
      "The WiFi connectivity in the library's 2nd-floor reading hall has been completely absent for three days. This is severely impacting students' ability to conduct research and access online academic resources during exam preparation period.",
    status: "under_review",
    submittedBy: "Dr. Priya Singh",
    submittedByRole: "faculty",
    submittedById: "u002",
    date: "2026-03-01",
    department: "IT Department",
    aiPlan: {
      step1:
        "IT team to remotely diagnose the access point logs for the affected floor and identify whether the issue is hardware or configuration-related.",
      step2:
        "Deploy a temporary WiFi extender or mobile hotspot in the reading hall within 6 hours to restore connectivity while permanent fix is implemented.",
      step3:
        "Replace or reconfigure the faulty access point, conduct signal strength testing, and confirm resolution with faculty submitter.",
      generatedAt: "2026-03-02",
    },
    comments: [],
  },
  {
    id: "CMP-003",
    title: "Overflowing Dustbins Near Canteen Area",
    category: "Cleanliness",
    location: "Main Canteen, Outdoor Seating Area",
    priority: "Medium",
    description:
      "The dustbins outside the main canteen have been overflowing for two days. Waste is spilling onto the ground, causing foul odors and attracting insects. This is a hygiene concern for students dining in the area.",
    status: "resolved",
    submittedBy: "Arjun Mehta",
    submittedByRole: "staff",
    submittedById: "u003",
    date: "2026-02-25",
    department: "Housekeeping",
    aiPlan: {
      step1:
        "Dispatch housekeeping team to immediately clear and sanitize the affected area and replace waste bags.",
      step2:
        "Increase dustbin collection frequency for the canteen area to twice daily and arrange pest control spray.",
      step3:
        "Install additional dustbins to handle peak-hour waste volume and update the cleaning schedule to prevent recurrence.",
      generatedAt: "2026-02-26",
    },
    comments: [
      {
        id: "c2",
        author: "Admin User",
        role: "admin",
        text: "Issue resolved. Housekeeping team cleared the area and increased collection frequency.",
        date: "2026-02-27",
      },
    ],
  },
  {
    id: "CMP-004",
    title: "Slippery Tiles on Staircase After Rain",
    category: "Safety",
    location: "Block C, Main Staircase (All Floors)",
    priority: "Critical",
    description:
      "After rainfall, the staircase tiles in Block C become extremely slippery and dangerous. Two students have already slipped on these stairs this month. There are no anti-slip mats or warning signage. This is an urgent safety concern.",
    status: "pending",
    submittedBy: "Rahul Sharma",
    submittedByRole: "student",
    submittedById: "u001",
    date: "2026-03-03",
    department: "Civil & Maintenance",
    aiPlan: {
      step1:
        "Immediately install temporary wet-floor caution signs on all affected staircases to warn students and prevent accidents.",
      step2:
        "Place anti-slip rubber mats on all staircase landings and apply anti-slip treatment to tiles within 72 hours.",
      step3:
        "Submit a permanent renovation request for installing anti-slip tile strips on all staircases and conduct monthly safety audits.",
      generatedAt: "2026-03-04",
    },
    comments: [],
  },
  {
    id: "CMP-005",
    title: "Projector Malfunction in Seminar Hall 3",
    category: "IT",
    location: "Block B, Seminar Hall 3",
    priority: "High",
    description:
      "The ceiling-mounted projector in Seminar Hall 3 has stopped displaying HDMI input from laptops. The projector powers on but shows 'No Signal' for all inputs. Classes using this hall are severely disrupted.",
    status: "in_progress",
    submittedBy: "Dr. Priya Singh",
    submittedByRole: "faculty",
    submittedById: "u002",
    date: "2026-02-20",
    department: "IT Department",
    aiPlan: {
      step1:
        "IT technician to inspect the HDMI cable, switcher, and projector input board to isolate the fault component.",
      step2:
        "Replace faulty HDMI cable or input board; if projector needs depot repair, arrange temporary portable projector for the hall.",
      step3:
        "Test all connectivity with multiple devices, confirm operability with faculty, and update inventory records.",
      generatedAt: "2026-02-21",
    },
    comments: [
      {
        id: "c3",
        author: "Arjun Mehta",
        role: "staff",
        text: "Technician assigned. HDMI board replacement ordered. ETA 3 days.",
        date: "2026-02-22",
      },
    ],
  },
  {
    id: "CMP-006",
    title: "No Seating in Female Students' Waiting Area",
    category: "Infrastructure",
    location: "Block D, Ground Floor",
    priority: "Medium",
    description:
      "The designated waiting area for female students outside the Dean's office in Block D has no seating arrangement. Students with appointments or those waiting for counseling sessions are forced to stand for extended periods.",
    status: "pending",
    submittedBy: "Rahul Sharma",
    submittedByRole: "student",
    submittedById: "u001",
    date: "2026-03-02",
    department: "Facilities Management",
    aiPlan: {
      step1:
        "Facilities manager to assess the space dimensions and submit a purchase request for 6 standard waiting chairs.",
      step2:
        "Install chairs in the waiting area within one week after procurement approval and arrange for regular cleaning.",
      step3:
        "Gather feedback from students using the area and consider adding a notice board for appointment schedules.",
      generatedAt: "2026-03-03",
    },
    comments: [],
  },
  {
    id: "CMP-007",
    title: "Examination Timetable Not Published",
    category: "Academic",
    location: "Academic Block, Exam Section",
    priority: "High",
    description:
      "The mid-semester examination timetable for the current academic batch has not been published on the university portal or notice boards, despite exams being scheduled within 10 days. Students are extremely anxious about preparation.",
    status: "resolved",
    submittedBy: "Dr. Priya Singh",
    submittedByRole: "faculty",
    submittedById: "u002",
    date: "2026-02-18",
    department: "Examination Section",
    aiPlan: {
      step1:
        "Academic section to immediately publish the drafted timetable on the official university portal and student LMS.",
      step2:
        "Send SMS/email notifications to all enrolled students with timetable details and any clash resolution information.",
      step3:
        "Display physical notice boards at all academic blocks and verify receipt acknowledgment from department heads.",
      generatedAt: "2026-02-18",
    },
    comments: [
      {
        id: "c4",
        author: "Admin User",
        role: "admin",
        text: "Timetable published on portal and notices posted. Issue resolved.",
        date: "2026-02-19",
      },
    ],
  },
  {
    id: "CMP-008",
    title: "Generator Noise Disturbance During Night Hours",
    category: "Infrastructure",
    location: "Hostel Block H-2, Near Generator Room",
    priority: "Low",
    description:
      "The diesel generator adjacent to Hostel Block H-2 produces excessive noise late at night (11 PM – 5 AM), disturbing students' sleep. The vibration dampeners appear to have worn out. This has been ongoing for three weeks.",
    status: "under_review",
    submittedBy: "Rahul Sharma",
    submittedByRole: "student",
    submittedById: "u001",
    date: "2026-02-28",
    department: "Electrical & Mechanical",
    aiPlan: {
      step1:
        "Maintenance team to inspect the generator mounts and vibration dampeners and measure decibel levels against permissible limits.",
      step2:
        "Replace worn-out vibration dampeners and install sound insulation panels around the generator room enclosure.",
      step3:
        "Conduct noise level testing post-repair and obtain sign-off from hostel warden and affected students.",
      generatedAt: "2026-03-01",
    },
    comments: [],
  },
  {
    id: "CMP-009",
    title: "Leaking Roof in Computer Lab",
    category: "Infrastructure",
    location: "Block A, Room 204 (Computer Lab)",
    priority: "Critical",
    description:
      "Water is leaking through the roof in Computer Lab 204 during monsoon rains and even after light showers. Multiple computers near the north wall have already been damaged. Immediate waterproofing is required before the next rain cycle.",
    status: "in_progress",
    submittedBy: "Arjun Mehta",
    submittedByRole: "staff",
    submittedById: "u003",
    date: "2026-03-01",
    department: "Civil & Maintenance",
    aiPlan: {
      step1:
        "Temporarily shift all computer equipment away from the leak zone and cover remaining hardware with waterproof sheets immediately.",
      step2:
        "Civil team to conduct roof inspection and apply emergency waterproofing sealant within 24 hours to stop active leakage.",
      step3:
        "Commission proper terrace waterproofing treatment and repair damaged computers through insurance claim; document for audit.",
      generatedAt: "2026-03-02",
    },
    comments: [
      {
        id: "c5",
        author: "Admin User",
        role: "admin",
        text: "Civil team dispatched. Temporary sealant applied. Permanent repair scheduled next week.",
        date: "2026-03-03",
      },
    ],
  },
  {
    id: "CMP-010",
    title: "Insufficient Parking Space for Faculty Vehicles",
    category: "Infrastructure",
    location: "Faculty Parking Zone, Gate 2",
    priority: "Low",
    description:
      "The dedicated faculty parking area near Gate 2 has only 12 marked spots for over 60 faculty members. Daily parking disputes and unauthorized parking in restricted zones are causing friction among staff.",
    status: "pending",
    submittedBy: "Dr. Priya Singh",
    submittedByRole: "faculty",
    submittedById: "u002",
    date: "2026-03-04",
    department: "Administration",
    aiPlan: {
      step1:
        "Conduct a parking demand survey across all faculty and identify peak usage hours and preferred spots.",
      step2:
        "Implement a numbered parking permit system and extend the parking zone by converting adjacent unused land temporarily.",
      step3:
        "Submit long-term proposal to university administration for permanent parking structure expansion in the annual budget plan.",
      generatedAt: "2026-03-05",
    },
    comments: [],
  },
];

// ============================================================
// DEPARTMENT LIST
// ============================================================
export const DEPARTMENTS = [
  "Facilities Management",
  "IT Department",
  "Civil & Maintenance",
  "Housekeeping",
  "Electrical & Mechanical",
  "Academic Section",
  "Examination Section",
  "Administration",
];
