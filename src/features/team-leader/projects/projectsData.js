// Calculate project progress based on completed tasks
export const calculateProjectProgress = (tasks = []) => {
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return Math.round((completedTasks / tasks.length) * 100);
};

export const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description:
      "Redesigning the company website to improve user experience and modernize the interface.",

    leaderId: 6,

    status: "In Progress",
    startDate: "2026-10-01",
    endDate: "2026-12-30",

    membersIds: [6, 1, 2, 7, 8],

    get progress() {
      return calculateProjectProgress(this.tasks);
    },

    tasks: [
      {
        id: 101,
        title: "UI/UX Research",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 102,
        title: "Homepage Design",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 103,
        title: "Frontend Development",
        status: "In Progress",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 104,
        title: "Backend Integration",
        status: "In Progress",
        priority: "Medium",
        assignedToId: null,
      },
      {
        id: 105,
        title: "Testing",
        status: "To Do",
        priority: "Medium",
        assignedToId: null,
      },
    ],

    activities: [
      {
        id: 1001,
        title: "Homepage Design completed",
        userId: 2,
        date: "2026-11-18",
      },
      {
        id: 1002,
        title: "Frontend Development started",
        userId: 7,
        date: "2026-11-16",
      },
      {
        id: 1003,
        title: "Project created",
        userId: 1,
        date: "2026-10-01",
      },
    ],
  },

  {
    id: 2,
    name: "Mobile Application",
    description:
      "Developing a mobile application for company employees.",

    leaderId: 2,

    status: "In Progress",
    startDate: "2026-10-15",
    endDate: "2027-01-15",

    membersIds: [2, 9, 7],

    get progress() {
      return calculateProjectProgress(this.tasks);
    },

    tasks: [
      {
        id: 201,
        title: "Requirements Analysis",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 202,
        title: "Application Design",
        status: "In Progress",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 203,
        title: "Mobile Development",
        status: "To Do",
        priority: "High",
        assignedToId: null,
      },
    ],

    activities: [
      {
        id: 2001,
        title: "Application design started",
        userId: 2,
        date: "2026-11-17",
      },
      {
        id: 2002,
        title: "Project created",
        userId: 2,
        date: "2026-10-15",
      },
    ],
  },

  {
    id: 3,
    name: "HR System",
    description:
      "Building an internal HR management system to manage employees and company operations.",

    leaderId: 9,

    status: "In Progress",
    startDate: "2026-09-01",
    endDate: "2026-12-20",

    membersIds: [9, 8, 1],

    get progress() {
      return calculateProjectProgress(this.tasks);
    },

    tasks: [
      {
        id: 301,
        title: "Database Design",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 302,
        title: "Employee Management",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 303,
        title: "Payroll Module",
        status: "In Progress",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 304,
        title: "System Testing",
        status: "To Do",
        priority: "Medium",
        assignedToId: null,
      },
    ],

    activities: [
      {
        id: 3001,
        title: "Payroll Module updated",
        userId: 9,
        date: "2026-11-19",
      },
      {
        id: 3002,
        title: "Employee Management completed",
        userId: 8,
        date: "2026-11-12",
      },
    ],
  },

  {
    id: 4,
    name: "Internal Dashboard",
    description:
      "Creating an internal analytics dashboard for company management.",

    leaderId: 8,

    status: "Completed",
    startDate: "2026-07-01",
    endDate: "2026-09-30",

    membersIds: [8, 1, 2],

    get progress() {
      return calculateProjectProgress(this.tasks);
    },

    tasks: [
      {
        id: 401,
        title: "Dashboard UI",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 402,
        title: "Analytics Integration",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 403,
        title: "Final Testing",
        status: "Completed",
        priority: "Medium",
        assignedToId: null,
      },
    ],

    activities: [
      {
        id: 4001,
        title: "Project completed",
        userId: 8,
        date: "2026-09-30",
      },
    ],
  },

  {
    id: 5,
    name: "Attendance System",
    description:
      "Developing a smart attendance system for tracking employee attendance.",

    leaderId: 7,

    status: "In Progress",
    startDate: "2026-10-10",
    endDate: "2026-12-25",

    membersIds: [7, 2, 9],

    get progress() {
      return calculateProjectProgress(this.tasks);
    },

    tasks: [
      {
        id: 501,
        title: "Attendance Requirements",
        status: "Completed",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 502,
        title: "Check-in Module",
        status: "In Progress",
        priority: "High",
        assignedToId: null,
      },
      {
        id: 503,
        title: "Reports Module",
        status: "To Do",
        priority: "Medium",
        assignedToId: null,
      },
    ],

    activities: [
      {
        id: 5001,
        title: "Check-in Module updated",
        userId: 7,
        date: "2026-11-18",
      },
    ],
  },
];